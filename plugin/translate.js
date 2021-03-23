import fs from "fs-extra";
import {tmt} from "tencentcloud-sdk-nodejs";

const TmtClient = tencentcloud.tmt.v20180321.Client;
const CONFIG = global.config.translate.tencent;
const SECRET_ID = CONFIG.secretId;
const SECRET_KEY = CONFIG.secretKey;
const clientConfig = {
    credential: {
        secretId: SECRET_ID,
        secretKey: SECRET_KEY,
    },
    region: CONFIG.region,
    profile: {
            httpProfile: {
            endpoint: "tmt.tencentcloudapi.com",
        },
    },
};
const client = (SECRET_ID != "" && SECRET_KEY != "") ? new TmtClient(clientConfig) : false;

let target = {};

function init(context = false) {
    if (fs.existsSync("data/translate.json")) {
        fs.readJSON("data/translate.json").then(permTarget => {
            target = permTarget;
        });
    }
    else {
        fs.writeJSON("data/translate.json", target);
    }
    context ? replyFunc(context, "刷新完成") : "";
}

function unescape(text) {
    return text.replace(/&amp;/g, "&").replace(/&#91;/g, "[").replace(/&#93;/g, "]")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function transAgent(sourceLang, targetLang, sourceText, context, reply = false) {
    translate(sourceLang, targetLang, sourceText).then(targetText => {
        if (!targetText) return;
        let trans_text = reply ? `[CQ:reply,id=${context.message_id}]${targetText}` : `[${targetText}]`;
        replyFunc(context, trans_text);
    });
}

async function translate(sourceLang, targetLang, sourceText) {
    return client.TextTranslate({
        "SourceText": unescape(sourceText),
        "Source": sourceLang,
        "Target": targetLang,
        "ProjectId": 0
    }).then(res => {
        return res.TargetText;
    }, (err) => {
        console.error("translate error", err);
        return false;
    });
}

function toTargetLang(lang_opt) {
    let target_lang = {
        "日" : "jp",
        "韩" : "kr",
        "英" : "en",
        "法" : "fr",
        "德" : "de",
        "俄" : "ru"
    }
    return target_lang[lang_opt];
}

function orientedTrans(context) {
    if (target[context.group_id] != undefined && target[context.group_id].some(aim => {return aim == context.user_id})) {
        if (/(开始|停止)定向翻译|停止全部翻译|定向翻译列表/.test(context.message)) return;
        let text = context.message.replace(/\[CQ.+\]/, "");
        if (text.length < 3) return;
        if (/[\u4e00-\u9fa5]+/.test(text) && !/[\u3040-\u30FF]/.test(text)) transAgent("zh", "jp", text, context, true);
        else transAgent("auto", "zh", text, context, true);
    }
    else return;
}

function pointTo(context, user_id) {
    if (target[context.group_id] === undefined) target[context.group_id] = [];
    target[context.group_id].push(parseInt(user_id));
    replyFunc(context, `接下来${user_id}说的每句话都会被翻译`);
    fs.writeJSON("data/translate.json", target);
    return;
}

function unpoint(context, user_id) {
    if (Array.isArray(user_id)) user_id = parseInt(user_id[0]);
    if (target[context.group_id] != undefined && 
    target[context.group_id].some(aim => {return aim == user_id})) {
        target[context.group_id] = target[context.group_id].filter(id => id != user_id);
        replyFunc(context, `对${user_id}的定向翻译已停止`);
        fs.writeJSON("data/translate.json", target);
    }
    else replyFunc(context, `${user_id}不在定向翻译列表中`);
}

function allClear(context) {
    const group_id = context.group_id;
    if (target[group_id] != undefined && target[group_id].length > 0) {
        delete target[group_id];
        replyFunc(context, "已清空本群所有目标");
        fs.writeJSON("data/translate.json", target);
    } else {
        replyFunc(context, "本群无目标");
    }
    return;
}

function viewTarget(context) {
    const target_group = target[context.group_id];
    if (target_group != undefined && target_group.length > 0) {
        let people = [];
        for (let user_id of target_group) {
            people.push(`[CQ:at,qq=${user_id}]`);
        }
        replyFunc(context, `定向翻译已对下列目标部署\n${people.join(", ")}`);
    }
    else replyFunc(context, `定向翻译无目标`);
}

function transEntry(context) {
    if (SECRET_ID != "" && SECRET_KEY != "") {
        if (/翻译[>＞].+/.test(context.message)) {
            let sourceText = context.message.substring(3, context.message.length);
            transAgent("auto", "zh", sourceText, context);
            return true;
        }
        else if (/中译[日韩英法德俄][>＞].+/.test(context.message)) {
            let target_lang = toTargetLang(/中译(.)[>＞]/.exec(context.message)[1]);
            transAgent("zh", target_lang, context.message.substring(4, context.message.length), context);
            return true;
        }
        else if (/^开始定向翻译(\s?(\d{7,10}?|\[CQ:at,qq=\d+\])\s?)?$/.test(context.message)) {
            let user_id = /\d+/.exec(context.message) || context.user_id;
            pointTo(context, user_id);
            return true;
        }
        else if (/^停止定向翻译(\s?(\d{7,10}?|\[CQ:at,qq=\d+\])\s?)?$/.test(context.message)) {
            let user_id = /\d+/.exec(context.message) || context.user_id;
            unpoint(context, user_id);
            return true;
        }
        else if (/^停止全部翻译$/.test(context.message)) {
            if (/owner|admin/.test(context.sender.role)) allClear(context);
            else replyFunc(context, "您配吗");
            return true;
        }
        else if (/^定向翻译列表$/.test(context.message)) {
            if (/owner|admin/.test(context.sender.role)) viewTarget(context);
            else replyFunc(context, "您配吗");
            return true;
        }
        else if (/^刷新翻译列表$/.test(context.message)) {
            if (!/member/.test(context.sender.role)) init(context);
            else replyFunc(context, "您配吗");
            return true;
        }
        else return false;
    }
    else return false;
}

init();

export default {transEntry, orientedTrans, translate};
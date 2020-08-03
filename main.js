import { version } from './package.json';
import CQWebsocket from 'cq-websocket';
import config from './modules/config';
import CQ from './modules/CQcode';
import Logger from './modules/Logger';
import RandomSeed from 'random-seed';
import _ from 'lodash';
import minimist from 'minimist';
import broadcast from './modules/broadcast';
import bilibili from './modules/plugin/bilibili';
import twitter from './modules/plugin/twitter';
import dice from './modules/plugin/dice';
import pretendLearn from "./modules/plugin/pretendLearn";
import translate from "./modules/plugin/translate";
import tweBBQ from "./modules/plugin/tweBBQ";

//常量
const setting = config.picfinder;
const rand = RandomSeed.create();
const signReg = new RegExp(setting.regs.sign);
const bot = new CQWebsocket(config);
const logger = new Logger();

twitter.twitterReply(replyMsg);
pretendLearn.learnReply(replyMsg, logger);
translate.transReply(replyMsg);
tweBBQ.cookTweReply(replyMsg);

setTimeout(() => bilibili.checkBiliDynamic(replyMsg), 20000);
setTimeout(() => twitter.checkTwiTimeline(), 40000);

//好友请求
bot.on('request.friend', context => {
    let approve = setting.autoAddFriend;
    const answers = setting.addFriendAnswers;
    if (approve && answers.length > 0) {
        const comments = context.comment.split('\n');
        try {
            answers.forEach((ans, i) => {
                const a = /(?<=回答:).*/.exec(comments[i * 2 + 1])[0];
                if (ans != a) approve = false;
            });
        } catch (e) {
            console.error(e);
            approve = false;
        }
    }
    if (approve)
        bot('set_friend_add_request', {
            flag: context.flag,
            sub_type: 'invite',
            approve: true,
        });
});

//加群请求
const groupAddRequests = {};
bot.on('request.group.invite', context => {
    if (setting.autoAddGroup)
        bot('set_group_add_request', {
            flag: context.flag,
            approve: true,
        });
    else groupAddRequests[context.group_id] = context.flag;
});

//管理员指令
bot.on('message.private', (e, context) => {
    if (context.user_id != setting.admin) return;

    const args = parseArgs(context.message);

    //允许加群
    const group = args['add-group'];
    if (group && typeof group == 'number') {
        if (typeof groupAddRequests[context.group_id] == 'undefined') {
            replyMsg(context, `将会同意进入群${group}的群邀请`);
            //注册一次性监听器
            bot.once('request.group.invite', context2 => {
                if (context2.group_id == group) {
                    bot('set_group_add_request', {
                        flag: context2.flag,
                        type: 'invite',
                        approve: true,
                    });
                    replyMsg(context, `已进入群${context2.group_id}`);
                    return true;
                }
                return false;
            });
        } else {
            bot('set_group_add_request', {
                flag: groupAddRequests[context.group_id],
                type: 'invite',
                approve: true,
            });
            replyMsg(context, `已进入群${context2.group_id}`);
            delete groupAddRequests[context.group_id];
        }
    }

    if (args.broadcast) broadcast(bot, parseArgs(context.message, false, 'broadcast'));

    //Ban
    const { 'ban-u': bu, 'ban-g': bg } = args;
    if (bu && typeof bu == 'number') {
        Logger.ban('u', bu);
        replyMsg(context, `已封禁用户${bu}`);
    }
    if (bg && typeof bg == 'number') {
        Logger.ban('g', bg);
        replyMsg(context, `已封禁群组${bg}`);
    }

    //停止程序（利用pm2重启）
    if (args.shutdown) process.exit();
});

//设置监听器
if (setting.debug) {
    //私聊
    bot.on('message.private', debugPrivateAndAtMsg);
    //讨论组@
    //bot.on('message.discuss.@me', debugRrivateAndAtMsg);
    //群组@
    bot.on('message.group.@me', debugPrivateAndAtMsg);
    //群组
    bot.on('message.group', debugGroupMsg);
} else {
    //私聊
    bot.on('message.private', privateAndAtMsg);
    //讨论组@
    //bot.on('message.discuss.@me', privateAndAtMsg);
    //群组@
    bot.on('message.group.@me', privateAndAtMsg);
    //群组
    bot.on('message.group', groupMsg);
    //提醒
    bot.on('notice.group_increase', notice);
    bot.on('notice.group_decrease', notice);
}

//连接相关监听
bot.on('socket.connecting', (wsType, attempts) => console.log(`${getTime()} 连接中[${wsType}]#${attempts}`))
    .on('socket.failed', (wsType, attempts) => console.log(`${getTime()} 连接失败[${wsType}]#${attempts}`))
    .on('socket.error', (wsType, err) => {
        console.error(`${getTime()} 连接错误[${wsType}]`);
        console.error(err);
    })
    .on('socket.connect', (wsType, sock, attempts) => {
        console.log(`${getTime()} 连接成功[${wsType}]#${attempts}`);
        if (setting.admin > 0) {
            setTimeout(() => {
                bot('send_private_msg', {
                    user_id: setting.admin,
                    message: `已上线[${wsType}]#${attempts}`,
                });
            }, 5000);
        }
    });

//connect
bot.connect();

//自动帮自己签到（诶嘿
//以及每日需要更新的一些东西
setInterval(() => {
    if (bot.isReady() && logger.canAdminSign()) {
        setTimeout(() => {
            if (setting.admin > 0) {
                bot('send_like', {
                    user_id: setting.admin,
                    times: 10,
                });
            }
        }, 60 * 1000);
    }
}, 60 * 60 * 1000);

function notice(context) {
    context.message_type = 'group';
    if (context.notice_type == 'group_increase') replyMsg(context, '年纪轻轻就进了这个群，你的未来毁了');
    else if (context.notice_type == 'group_decrease') replyMsg(context, '有人退了');
}

//通用处理
function commonHandle(e, context) {
    //黑名单检测
    if (Logger.checkBan(context.user_id, context.group_id)) return true;

    //兼容其他机器人
    const startChar = context.message.charAt(0);
    if (startChar == '/' || startChar == '<') return true;

    //通用指令
    const args = parseArgs(context.message);
    if (args.help) {
        replyMsg(context, 'https://github.com/Ninzore/BBQ');
        return true;
    }
    if (args.version) {
        replyMsg(context, version);
        return true;
    }
    if (args.about) {
        replyMsg(context, 'https://github.com/Ninzore/BBQ');
        return true;
    }

    return false;
}

//私聊以及群组@的处理
function privateAndAtMsg(e, context) {
    if (commonHandle(e, context)) {
        e.stopPropagation();
        return;
    }
    if (pixivImage.pixivCheck(context, replyMsg, bot) ||
        pretendLearn.learn(context) ||
        pokemon.pokemonCheck(context, replyMsg)) {
        e.stopPropagation();
        return;
    }
    if (signReg.exec(context.message)) {
        //签到
        e.stopPropagation();
        if (logger.canSign(context.user_id)) {
            bot('send_like', {
                user_id: context.user_id,
                times: 10,
            });
            return setting.replys.sign;
        } else return setting.replys.signed;
    } else {
        //其他指令
        return setting.replys.default;
    }
}

//调试模式
function debugPrivateAndAtMsg(e, context) {
    if (context.user_id != setting.admin) {
        e.stopPropagation();
        return setting.replys.debug;
    }
    return privateAndAtMsg(e, context);
}

function debugGroupMsg(e, context) {
    if (context.user_id != setting.admin) e.stopPropagation();
    else return groupMsg(e, context);
}

//群组消息处理
function groupMsg(e, context) {
    if (commonHandle(e, context)) {
        e.stopPropagation();
        return;
    }
 
    const { group_id, user_id } = context;

    if (bilibili.bilibiliCheck(context) ||
        twitter.twitterAggr(context) ||
        tweBBQ.complex(context, replyMsg) ||
        translate.transEntry(context)) {
        e.stopPropagation();
        return;
    }
    else if (/^\.dice.+/g.exec(context.message)) {
        dice(context, replyMsg, rand);
        e.stopPropagation();
        return;
    }
    else if (setting.repeat.enable) {
        //复读（
        //随机复读，rptLog得到当前复读次数
        if (logger.rptLog(group_id, user_id, context.message) >= setting.repeat.times && getRand() <= setting.repeat.probability) {
            logger.rptDone(group_id);
            //延迟2s后复读
            setTimeout(() => {
                replyMsg(context, context.message);
            }, 1000);
        } else if (getRand() <= setting.repeat.commonProb) {
            //平时发言下的随机复读
            setTimeout(() => {
                replyMsg(context, context.message);
            }, 1000);
        } else {
            if (getRand() <= 80) pretendLearn.talk(context);
        }
    }
}


/**
 * 判断消息是否有图片
 *
 * @param {string} msg 消息
 * @returns 有则返回true
 */
function hasImage(msg) {
    return msg.indexOf('[CQ:image') !== -1;
}

/**
 * 回复消息
 *
 * @param {object} context 消息对象
 * @param {string} msg 回复内容
 * @param {boolean} at 是否at发送者
 */
function replyMsg(context, msg, at = false) {
    if (typeof msg !== 'string' || msg.length === 0) return;
    switch (context.message_type) {
        case 'private':
            return bot('send_private_msg', {
                user_id: context.user_id,
                message: msg,
            });
        case 'group':
            return bot('send_group_msg', {
                group_id: context.group_id,
                message: at ? CQ.at(context.user_id) + msg : msg,
            });
        case 'discuss':
            return bot('send_discuss_msg', {
                discuss_id: context.discuss_id,
                message: at ? CQ.at(context.user_id) + msg : msg,
            });
    }
}

/**
 * 生成随机浮点数
 *
 * @returns 0到100之间的随机浮点数
 */
function getRand() {
    return rand.floatBetween(0, 100);
}

function getTime() {
    return new Date().toLocaleString();
}

function parseArgs(str, enableArray = false, _key = null) {
    const m = minimist(
        str
            .replace(/(--\w+)(?:\s*)(\[CQ:)/g, '$1 $2')
            .replace(/(\[CQ:[^\]]+\])(?:\s*)(--\w+)/g, '$1 $2')
            .split(' '),
        {
            boolean: true,
        }
    );
    if (!enableArray) {
        for (const key in m) {
            if (key == '_') continue;
            if (Array.isArray(m[key])) m[key] = m[key][0];
        }
    }
    if (_key && typeof m[_key] == 'string' && m._.length > 0) m[_key] += ' ' + m._.join(' ');
    return m;
}
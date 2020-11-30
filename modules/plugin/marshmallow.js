const puppeteer = require('puppeteer');

let replyFunc = (context, msg, at = false) => {};

async function toast(context, text, reply = true) {
    let browser = await puppeteer.launch({
        args : ['--no-sandbox', '--disable-dev-shm-usage']
    });
    let page = await browser.newPage();
    await page.goto(`file:///${__dirname}/marshmallow/marshmallow.html`, {waitUntil : "networkidle0"});
    try {
        await page.evaluate((text) => {
            document.getElementsByClassName("content")[0].innerText = text;
        }, text);
    }
    catch(err) {
        console.error(err);
        replyFunc(context, "出错惹", true);
        await browser.close();
        return;
    }

    let content_box = await page.$('.message-card').then((card_box) => {return card_box.boundingBox()});

    await page.setViewport({
        width: 630,
        height: Math.round(content_box.height + 100),
        deviceScaleFactor: 1.6
    });

    let pic = await page.screenshot({
        type : "jpeg",
        quality : 100,
        encoding : "base64",
        clip : {x : content_box.x, y : content_box.y, width : 598, height : Math.round(content_box.height)}
    }).then(pic64 => {
        if (reply === true) replyFunc(context, `[CQ:image,file=base64://${pic64}]`);
        return pic64;
    });

    await browser.close();
    return pic;
}

function prepare(context, replyMsg) {
    if (/^烤棉花糖\s?[>＞]\s?.+/i.test(context.message)) {
        replyFunc = replyMsg;
        if (/\[CQ:image/.test(context.message)) {
            replyFunc(context, "不能插图的别想了", true);
        }
        else {
            let text = context.message.substring(5, context.message.length).trim();
            if (text.length < 1500) {
                toast(context, text);
            }
            else {
                replyFunc(context, "别，这个有点长", true);
            }
            return true;
        }
    }
    else return false;
}

module.exports = {prepare, toast};
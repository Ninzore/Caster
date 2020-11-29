const puppeteer = require('puppeteer');

let replyFunc = (context, msg, at = false) => {};

async function cookMarshmallow(context, text) {
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

    let content_box = await page.$('.card').then((card_box) => {return card_box.boundingBox()});

    await page.setViewport({
        width: content_box.x + content_box.width,
        height: content_box.height + 100,
        deviceScaleFactor: 1.6
    });

    await page.screenshot({
        type : "jpeg",
        quality : 100,
        encoding : "base64",
        clip : {x : content_box.x, y : 10, width : 617, height : content_box.y + content_box.height - 15}
    }).then(pic64 => replyFunc(context, `[CQ:image,file=base64://${pic64}]`));

    await browser.close();
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
                cookMarshmallow(context, text);
            }
            else {
                replyFunc(context, "别，这个有点长", true);
            }
            return true;
        }
    }
    else return false;
}

module.exports = {prepare};
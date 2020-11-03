const puppeteer = require('puppeteer');
const mongodb = require('mongodb').MongoClient;
const axios = require('axios');

const DB_PORT = 27017;
const DB_PATH = "mongodb://127.0.0.1:" + DB_PORT;
const TWEMOJI = "(?:\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d])|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udeeb\udeec\udef4-\udefc\udfe0-\udfeb]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78\udd7a-\uddb4\uddb7\uddba\uddbc-\uddcb\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7a\ude80-\ude86\ude90-\udea8\udeb0-\udeb6\udec0-\udec2\uded0-\uded6]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f";
const TWEMOJI_REG = new RegExp(TWEMOJI, "g");
const TWEMOJI_GROUP_REG = new RegExp(`(${TWEMOJI})+`, "g");

let connection = true;

const defaultTemplate = {
    article : {
        css : "",
        size : 'inherit',
        color : 'inherit',
        background : "",
        font_family : "Source-han-sans",
        text_decoration : ""
    },
    group : {
        group_info : "翻译",
        css : "",
        size : '13px',
        color : 'rgb(27, 149, 224)' ,
        background : "",
        font_family : "Source-han-sans",
        text_decoration : "",
        logo_in_reply : "翻译"
    },
    cover_origin : false,
    no_group_info : false,
    cover_origin_in_reply : false,
    no_group_info_in_reply : false
}

let replyFunc = (context, msg, at = false) => {};

function cookTweReply(replyMsg) {
    replyFunc = replyMsg;
}

/** 检查网络情况，如果连不上Twitter那后面都不用做了*/
function checkConnection() {
    return axios.get("https://twitter.com").then(res => {connection = (res.status == 200) ? true : false}).catch(err => connection = false);
}

/**
 * Twitter截图
 * @param {object} context 
 * @param {string} twitter_url 单条Tweet网址
 * @param {object} trans_args 所有翻译相关选项
 */
async function cook(context, twitter_url, trans_args={}) {
    try {
        replyFunc(context, "收到，如果2分钟后还没有图可能是瘫痪了");
        let tweet = await getTweet(twitter_url);
        if (!tweet) {
            throw 1;
        }
        let browser = await puppeteer.launch({
            args : ['--no-sandbox', '--disable-dev-shm-usage'], headless: true
        });
        let page = await browser.newPage();
        await page.setExtraHTTPHeaders({
            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36",
            "accept-language" : "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
            "DNT" : "1"
        });
        await page.setBypassCSP(true);
        await page.emulateTimezone('Asia/Tokyo');
        await page.goto(twitter_url, {waitUntil : "networkidle0"});

        if (trans_args && Object.keys(trans_args).length > 0) {
            let html_ready = await setupHTML(trans_args, tweet.full_text);
            if (trans_args.cover_origin != undefined && trans_args.cover_origin_in_reply == undefined) {
                trans_args.cover_origin_in_reply = trans_args.cover_origin;
            }
            if (trans_args.no_group_info != undefined && trans_args.no_group_info_in_reply == undefined) {
                trans_args.no_group_info_in_reply = trans_args.no_group_info;
            }
            if (trans_args.article.retweet != undefined) {
                trans_args.article.retweet = `<div class="css-901oao">${decoration(trans_args.article.retweet, trans_args.article)}</div>`;
            }
            html_ready.logo_in_reply = 
                `<div style="margin: 1px 0px 2px 1px; display: inline-block;">${decoration(defaultTemplate.group.logo_in_reply, defaultTemplate.group)}</div>`;

            await page.evaluate((html_ready, trans_args, tweet) => {
                let banner = document.getElementsByTagName('header')[0];
                banner.parentNode.removeChild(banner);
                let header = document.getElementsByClassName("css-1dbjc4n r-aqfbo4 r-14lw9ot r-my5ep6 r-rull8r r-qklmqi r-gtdqiz r-ipm5af r-1g40b8q")[0];
                header.parentNode.removeChild(header);
                let footer = document.getElementsByClassName('css-1dbjc4n r-aqfbo4 r-1p0dtai r-1d2f490 r-12vffkv r-1xcajam r-zchlnj')[0];
                footer.parentNode.removeChild(footer);

                let articles = document.querySelectorAll('article');
                let article = articles[0].querySelector('[role=group]').parentElement;
                insert(article, html_ready.trans_article_html, 
                    html_ready.reply_html != undefined ? ((trans_args.no_group_info && trans_args.no_group_info_in_reply) ? '' : html_ready.logo_in_reply) 
                        : html_ready.trans_group_html
                    , trans_args.cover_origin);

                if ("quoted_status" in tweet && "possibly_sensitive" in tweet.quoted_status && tweet.quoted_status.possibly_sensitive == true) {
                    if (articles[0].querySelector('[href="/settings/safety"]') != null) {
                        articles[0].querySelector('[href="/settings/safety"]').parentElement.parentElement.parentElement.children[1].firstChild.click();
                    }
                }

                let video = article.querySelector('[data-testid="videoPlayer"]');
                if (video) {
                    let poster = "";
                    if (video.querySelector('[poster]') != null) poster = video.querySelector('[poster]').poster;
                    else {
                        let media = tweet.extended_entities.media;
                        for (let i = 0; i < media.length; i++) {
                            if (media[i].type == "animated_gif" || media[i].type == "video") {
                                poster = media[i].media_url_https;
                                break;
                            }
                        }
                    }
                    video.firstChild.lastChild.innerHTML = `<img style="max-height:100%; max-width:100%" src="${poster}">`;
                }

                if (trans_args.article.quote != undefined) {
                    let quote_block = document.querySelector('[role="blockquote"]')
                    if (!quote_block) quote_block = document.getElementsByClassName("r-dap0kf")[0];
                    quote_block.firstChild.children[1].lastChild.innerHTML = html_ready.quote_html;
                }

                if (trans_args.article.choice != undefined) {
                    let choice_list = article.children[1].querySelectorAll("span");
                    for (let i = 0; i < choice_list.length/2; i++) choice_list[2*i].innerText = trans_args.article.choice[i];
                }

                if (html_ready.reply_html != undefined) {
                    for (let i = 0; i < html_ready.reply_html.length; i++) {
                        if (i+1 >= articles.length) break;
                        else {
                            article = articles[i+1].querySelector('[role=group]').parentElement;
                            insert(article, html_ready.reply_html[i], 
                                trans_args.no_group_info_in_reply ? '' 
                                : (i+1 == html_ready.reply_html.length ? html_ready.trans_group_html : html_ready.logo_in_reply),
                                trans_args.cover_origin_in_reply);
                        }
                    }
                }
                function insert(article, translation_html, group_html, cover_origin=false) {
                    let trans_place = document.createElement('div');
                    let node_group_info = document.createElement('div');
                    let node_trans_article = document.createElement('div');
                
                    trans_place.lang = "zh";
                    node_group_info.innerHTML = group_html;
                    node_trans_article.innerHTML = translation_html;
                
                    if (/^回复 \n@/.test(article.firstElementChild.innerText)) article = article.children[1].firstElementChild;
                    else article = article.firstElementChild.firstElementChild;
                    if (article == null) return;

                    node_trans_article.className = article.firstElementChild.className;
                    node_trans_article.style.width = "100%";

                    trans_place.appendChild(node_group_info);
                    trans_place.appendChild(node_trans_article);

                    if (cover_origin) article.firstElementChild.replaceWith(trans_place);
                    else article.appendChild(trans_place);
                }
                document.querySelector("#react-root").scrollIntoView(true);
            }, html_ready, trans_args, tweet);
        }
        else {
            await page.evaluate(() => {
                let banner = document.getElementsByTagName('header')[0];
                banner.parentNode.removeChild(banner);
                let header = document.getElementsByClassName("css-1dbjc4n r-aqfbo4 r-14lw9ot r-my5ep6 r-rull8r r-qklmqi r-gtdqiz r-ipm5af r-1g40b8q")[0];
                header.parentNode.removeChild(header);
                let footer = document.getElementsByClassName('css-1dbjc4n r-aqfbo4 r-1p0dtai r-1d2f490 r-12vffkv r-1xcajam r-zchlnj')[0];
                footer.parentNode.removeChild(footer);
                document.querySelector("#react-root").scrollIntoView(true);
            });
        }
        
        await page.waitFor(2000);
        let tweet_box = await page.$('article .css-1dbjc4n .r-vpgt9t').then((tweet_article) => {return tweet_article.boundingBox()});
    
        await page.setViewport({
            width: 800,
            height: Math.round(tweet_box.y + 200),
            deviceScaleFactor: 1.6
        });
        await page.screenshot({
            type : "jpeg",
            quality : 100,
            encoding : "base64",
            clip : {x : tweet_box.x - 15, y : -2, width : tweet_box.width + 27, height : tweet_box.y + tweet_box.height + 12}
        }).then(pic64 => replyFunc(context, `[CQ:image,file=base64://${pic64}]`));

        await browser.close();
    } catch(err) {
        if (err == 1) {
            replyFunc(context, `没有${twitter_url}这条Twitter\n可能是被删了`, true);
        }
        else {
            console.error(err);
            replyFunc(context, "出错惹", true);
        }
    }
}

async function serialTweet(context, twitter_url, trans_args={}) {
    let tweet = await getTweet(twitter_url);

    if ("in_reply_to_status_id" in tweet && tweet.in_reply_to_user_id != null) {
        replyFunc(context, "这个功能不能烤回复推！", true);
        return;
    }
    let browser = await puppeteer.launch({
        args : ["--no-sandbox", "--disable-dev-shm-usage"], ignoreDefaultArgs : ["--enable-automation"], headless: true
    });
    let page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.setExtraHTTPHeaders({
        "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36",
        "accept-language" : "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
        "DNT" : "1"
    });
    await page.emulateTimezone('Asia/Tokyo');
    let {groups : {username, tweet_id}} = /https:\/\/twitter\.com\/(?<username>.+?)\/status\/(?<tweet_id>\d+)/i.exec(twitter_url);
    await page.goto(`https://twitter.com/search?q=(from:${username}) -filter:replies&f=live`, {waitUntil : "networkidle0"});

    try {
        await page.waitForSelector(`[href$="${tweet_id}"]`, {visible : true, timeout : 10000});
    } catch(err) {
        replyFunc(context, "大失败！可能是：\n链接错误或者太过远古或者连接超时", true);
        await browser.close();
        return;
    };

    try {
        let html_ready = await setupHTML(trans_args);
        await page.evaluate((html_ready, trans_args, tweet_id) => {
            let header = document.getElementsByClassName("css-1dbjc4n r-aqfbo4 r-14lw9ot r-my5ep6 r-rull8r r-qklmqi r-gtdqiz r-ipm5af r-1g40b8q")[0];
            header.parentNode.removeChild(header);
            let footer = document.getElementsByClassName('css-1dbjc4n r-aqfbo4 r-1p0dtai r-1d2f490 r-12vffkv r-1xcajam r-zchlnj')[0];
            footer.parentNode.removeChild(footer);

            let articles = document.querySelectorAll('article');
            let focus = 0;

            for (let i = 0; i < articles.length; i++) {
                let article = articles[i];
                if (article.querySelector(`[href$="${tweet_id}"]`) != null) {
                    article.scrollIntoView(true);
                    focus = i;
                    break;
                }
                else article.parentElement.removeChild(article);
            }

            for (let i = 0; i < html_ready.serialTrans.length; i++) {
                insert(articles[focus + i].querySelector('[role=group]').parentElement, html_ready.serialTrans[i], 
                    html_ready.no_group_info ? "" : html_ready.trans_group_html, trans_args.cover_origin);
            }
            
            function insert(article, translation_html, group_html, cover_origin=false) {
                let trans_place = document.createElement('div');
                let node_group_info = document.createElement('div');
                let node_trans_article = document.createElement('div');
            
                trans_place.lang = "zh";
                node_group_info.innerHTML = group_html;
                node_trans_article.innerHTML = translation_html;
                
                if (/^回复 \n@/.test(article.firstElementChild.innerText)) article = article.children[1].firstElementChild;
                else article = article.firstElementChild.firstElementChild;
                if (article == null) return;
                
                trans_place.appendChild(node_group_info);
                trans_place.appendChild(node_trans_article);

                if (cover_origin) article.replaceWith(trans_place);
                else article.appendChild(trans_place);
            }
        }, html_ready, trans_args, tweet_id);

        await page.waitFor(2000);
        let box = await page.evaluate((html_ready) => {
            document.querySelector("#react-root").scrollIntoView(true);
            let articles = document.querySelectorAll('article');
            let box = {};
            box.first = articles[0].getBoundingClientRect();
            box.last = articles[html_ready.serialTrans.length - 1].getBoundingClientRect();
            return JSON.stringify(box);
        }, html_ready)
        box = JSON.parse(box);

        await page.setViewport({
            width: 800,
            height: Math.round(box.last.bottom + 200),
            deviceScaleFactor: 1.8
        });

        await page.screenshot({
            type : "jpeg",
            quality : 100,
            encoding : "base64",
            clip : {x : box.first.x, y : 3, width : box.first.width - 7, height : box.last.bottom - 4},
        }).then(pic64 => replyFunc(context, `[CQ:image,file=base64://${pic64}]`));

    } catch(err) {
        console.error(err);
        replyFunc(context, "出错惹", true);
        await browser.close();
        return;
    }
    
    await browser.close();
}

function getTweet(twitter_url) {
    return axios({
        method:'GET',
        url: "https://api.twitter.com/1.1/statuses/lookup.json",
        headers : {"authorization" : "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"},
        params : {
            "id" : /status\/(\d+)/.exec(twitter_url)[1],
            "include_entities" : "true",
            "include_ext_alt_text" : "true",
            "include_card_uri" : "true",
            "tweet_mode" : "extended",
            "trim_user" : "false"
        }
    }).then(res => {return res.data[0];});
}

async function setupHTML(trans_args, origin_text = "") {
    trans_args = fillTemplate(trans_args);
    let html_ready = {}
    if (trans_args.article.origin != undefined) {
        html_ready.trans_article_html = trans_args.article_html == undefined ? 
            decoration(trans_args.article.origin, trans_args.article, origin_text ? origin_text : false) : trans_args.article_html;
        // html_ready.trans_article_html = `<div class="css-901oao r-hkyrab r-1tl8opc r-1blvdjr r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0">${html_ready.trans_article_html}</div>`
        html_ready.trans_article_html = `<div style="display: block; overflow-wrap: break-word;">${html_ready.trans_article_html}</div>`
    }
    
    if ("serialTrans" in trans_args.article && trans_args.article.serialTrans.length > 0) {
        html_ready.serialTrans = [];
        for (let trans of trans_args.article.serialTrans) {
            html_ready.serialTrans.push(['<div style="display: block; white-space: pre-wrap; overflow-wrap: break-word;">',
                `${decoration(trans, trans_args.article)}</div>`].join(""));
        }
    }
    if (trans_args.article.quote != undefined) {
        html_ready.quote_html = 
            `<div style="display: block; white-space: pre-wrap; overflow-wrap: break-word;">${decoration(trans_args.article.quote, trans_args.article)}</div>`;
    }
    if (trans_args.article.reply != undefined) {
        html_ready.reply_html = [];
        for (let reply of trans_args.article.reply) html_ready.reply_html.push(
            `<div style="display: block; white-space: pre-wrap; overflow-wrap: break-word;">${decoration(reply, trans_args.article)}</div>`);
    }
    if (!trans_args.no_group_info) {
        if (/^http/.test(trans_args.group.group_info)) {
            trans_args.group.size = trans_args.group.size == defaultTemplate.group.size ? '30px' : trans_args.group.size;
            let img64 = "data:image/jpeg;base64," + await axios.get(trans_args.group.group_info, {responseType:'arraybuffer'})
                                                                .then(res => {return Buffer.from(res.data, 'binary').toString('base64')});
            html_ready.trans_group_html = `<img style="margin: 2px 0px -3px 1px; height: auto; width: auto; max-height: ${trans_args.group.size}; max-width: 100%;" src="${img64}">`;
        }
        else {
            html_ready.trans_group_html = (trans_args.group_html == undefined) ? 
                ['<div dir="auto" class="css-901oao r-hkyrab r-1tl8opc r-1blvdjr r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0" style="display: block; margin: 0px 0px 3px 1px;">', 
                decoration(trans_args.group.group_info, trans_args.group), '</div>'].join("")
                : ['<div dir="auto" class="css-901oao r-hkyrab r-1tl8opc r-1blvdjr r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0;" style="margin: 0px 0px 4px 1px; display: block;">', trans_args.group_html, '</div>'].join("");
        }
    }
    else html_ready.trans_group_html = "";
    return html_ready;
}

function decoration(text, template, origin_text = "") {
    let css = ('css' in template && template.css.length > 1) ? template.css
        : template ? `font-family: ${template.font_family}; font-size: ${template.size}; text-decoration: ${template.text_decoration}; color: ${template.color}; background: ${template.background};` : "all: inherit;";

    let ready_html = 
        `<div class="css-901oao css-1dbjc4n" style="display: block; white-space: pre-wrap; overflow-wrap: break-word; ${css}">${parseString(text, origin_text)}</div>`;

    return ready_html;
}

function parseString(text, origin_text = false) {
    text = text.replace(/((#|@)\S+?)(?=[】\])\s])/g,'<span style="color:#1DA1F2;">$1</span>')
                .replace(/((https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/g,'<span style="color:#1DA1F2;">$1</span>');

    if (/\/e/.test(text) && origin_text != false) {
        let ori = [...origin_text.matchAll(TWEMOJI_GROUP_REG)];
        let replacement = [...text.matchAll(/\/e/g)];
        for (let i = 0; i < replacement.length; i++) {
            if (i > ori.length -1) break;
            text = text.replace(/\/e/, ori[i][0]);
        }
    }

    let capture = [...text.matchAll(TWEMOJI_REG)];
    let ready_html = "";
    let string_html = "";
    let emoji_html = "";

    if (capture[0] != undefined) {
        let offset = 0;
        let code = "";
        let part = "";
        for (let emoji of capture) {
            code = emoji[0].codePointAt(0).toString(16);
            part = text.substring(offset, emoji.index);
            string_html = (part.length > 0) ? crtString(part) : "";
            emoji_html =
                [`<span dir="auto" class="css-901oao css-16my406 r-4qtqp9 r-ip8ujx r-sjv1od r-zw8f10 r-bnwqim r-h9hxbl">`,
                `<div aria-label="${emoji[0]}" class="css-1dbjc4n r-xoduu5 r-1mlwlqe r-1d2f490 r-1udh08x r-u8s1d r-h9hxbl r-417010" style="height: 1.2em;">`,
                '<div class="css-1dbjc4n r-1niwhzg r-vvn4in r-u6sd8q r-x3cy2q r-1p0dtai r-xoduu5 r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw"',
                `style="background-image: url(&quot;https://abs-0.twimg.com/emoji/v2/svg/${code}.svg&quot;);"></div>`,
                `<img alt="${emoji[0]}" draggable="false" src="https://abs-0.twimg.com/emoji/v2/svg/${code}.svg" class="css-9pa8cd"></div></span>`].join("");

                ready_html += (offset > emoji.index) ? emoji_html + string_html : string_html + emoji_html;
                offset = emoji.index + emoji[0].length;
        }
        if (offset < text.length) ready_html += crtString(text.substr(offset, text.length-1));
    }
    else {
        ready_html = crtString(text);
    }
    return ready_html;
    
    function crtString(text_part) {
        return `<span style="overflow-wrap: break-word;">${text_part}</span>`;
    }
}

function setTemplate(unparsed) {
    let trans_args = {article : {}, group : {}};
    let style_options = unparsed.split(/[+＋]/);
    let option = "";
    let style = "";
    let err = false;
    let option_map = {
        "翻译" : "origin",
        "连续翻译" : "serialTrans",
        "回复" : "reply",
        "颜色" : "color",
        "大小" : "size",
        "字体" : "font_family",
        "装饰" : "text_decoration",
        "css" : "css",
        "汉化组" : "group_info",
        "汉化组大小" : "group_size",
        "汉化组颜色" : "group_color",
        "汉化组字体" : "group_font_family",
        "汉化组装饰" : "group_text_decoration",
        "汉化组css" : "group_css",
        "背景" : "background",
        "引用" : "quote",
        "选项" : "choice",
        "覆盖" : "cover_origin",
        "无汉化组" : "no_group_info",
        "回复中覆盖" : "cover_origin_in_reply",
        "回复中无汉化组" : "no_group_info_in_reply",
        "group_html" : "group_html",
        "article_html" : "article_html",
        "error" : false
    }

    for (let i in style_options) {
        option = style_options[i].split(/(?<!<.+(style))[=＝]/).filter((noEmpty) => {return noEmpty != undefined});
        style = option_map[option[0].trim().replace(/<br>/g, "")] || option_map["error"];

        if (!style) err = `没有${option[0]}这个选项`;
        else if (style == "article_html" || style == "group_html") trans_args[style] = option[1].trim();
        else {
            if (style == "origin" || style == "reply" || style == "group_info");
            else if (option[1]) option[1].trim().replace(/<br>/g, "");

            if (/^group_/.test(style) && !/\[CQ:image/.test(option[1])) trans_args.group[style.replace(/^group_(?!info)/, "")] = option[1];
            else if (style == 'cover_origin') trans_args.cover_origin = true;
            else if (style == 'no_group_info') trans_args.no_group_info = true;
            else if (style == 'cover_origin_in_reply') trans_args.cover_origin_in_reply = true;
            else if (style == 'no_group_info_in_reply') trans_args.no_group_info_in_reply = true;
            else if (style == 'group_info' && /\[CQ:image/.test(option[1])) trans_args.group.group_info = /(http.+?)\?/.exec(option.join(""))[1];
            else if (style == 'choice') {
                trans_args.article.choice = option[1].split(/[;；]/).filter((noEmpty) => {return noEmpty != undefined && noEmpty.length > 0});
            }
            else if (style == 'reply') {
                if (!Array.isArray(trans_args.article.reply)) trans_args.article.reply = [option[1]];
                else trans_args.article.reply.push(option[1]);
            }
            else if (style == "serialTrans") {
                trans_args.article.serialTrans = option[1].split(/[;；]/, 10);
            }
            else trans_args.article[style] = option[1];
        }
    }

    return {trans_args : trans_args, err : err};
}

function fillTemplate(template = {}) {
    return new Proxy(template, handler = {
        get : (target, prop) => {
            if (typeof(defaultTemplate[prop]) === 'object') {
                return !Reflect.has(target, prop) ? defaultTemplate[prop] :
                    new Proxy(target[prop], handler = {
                        get : (deep_target, deep_prop) => {
                            return Reflect.has(deep_target, deep_prop) ? deep_target[deep_prop] : defaultTemplate[prop][deep_prop];
                        }
                    });
            }
            return target.hasOwnProperty(prop) ? target[prop] : defaultTemplate[prop];
        }
    });
}

function saveTemplate(context, username, unparsed_text) {
    let {trans_args, err} = setTemplate(unparsed_text);

    if (err) {
        replyFunc(context, err, true);
        return;
    };
    if ('origin' in trans_args.article || 'reply' in trans_args.article || "retweet" in trans_args.article || "choice" in trans_args.article) {
        replyFunc(context, '不能将翻译内容加入模板', true);
        return;
    }

    mongodb(DB_PATH, {useUnifiedTopology: true}).connect().then(async mongo => {
        let coll = mongo.db('bot').collection('twiBBQ');
        try {
            await coll.updateOne({username : username}, 
                {$set : {trans_args, group_id : context.group_id}}, {upsert : true});
            // replyFunc(context, `成功保存了${username}的模板，恭喜恭喜`);
            replyFunc(context, `恭喜👏 ${username} 👏恭喜\n  恭喜 👏 👏 👏 恭喜\n     恭喜 👏    👏 恭喜`);
        } catch(err) {
            console.error(err);
            replyFunc(context, "出错惹");
        } finally {mongo.close();}
    });
}

function findTemplate(username, group_id) {
    return mongodb(DB_PATH, {useUnifiedTopology: true}).connect().then(async mongo => {
        let coll = mongo.db('bot').collection('twiBBQ');
        try {
            let res = await coll.findOne({group_id : group_id});
            if (res) return res.trans_args;
            else res = await coll.findOne({username : username});
            return (res) ? res.trans_args : false;
        } catch(err) {console.error(err);
        } finally {mongo.close();}
    });
}

function seasoning(context) {
    let raw = context.message.replace(/\r\n/g, "<br>");
    try {
        let {groups : {twitter_url, username}} = /(?<twitter_url>https:\/\/twitter.com\/(?<username>.+?)\/status\/\d+)(?:\?s=\d{1,2})?/i.exec(raw);
        let text_index = /[>＞]{1,2}/.exec(raw);
        let text = raw.substring(text_index.index);

        findTemplate(username, context.group_id).then(async saved_trans_args => {
            if (!saved_trans_args) saved_trans_args = defaultTemplate;
            
            if (/[>＞]{2}/.test(text)) {
                text = text.substring(2).trim().replace(/^<br>/, "");
                saved_trans_args.article.origin = text;
                cook(context, twitter_url, saved_trans_args);
            }
            else {
                text = text.substring(1).trim();
                let {trans_args, err} = setTemplate(text);
                if (err) {
                    replyFunc(context, err, true);
                    return
                };

                [saved_trans_args, trans_args].reduce((prev, next) => {
                    for (let key in prev) {
                        if (typeof(prev[key]) == "object") {
                            next[key] = {...prev[key], ...next[key]};
                        }
                        else next[key] = next[key] != undefined ? next[key] : prev[key];
                    }
                    return next;
                })
                
                if (!('trans_html' in trans_args) && !('origin' in trans_args.article) 
                    && !('reply' in trans_args.article) && !('serialTrans' in trans_args.article)) {
                    replyFunc(context, "你没加翻译", true);
                    return;
                }
                if ("serialTrans" in trans_args.article) {
                    if ('origin' in trans_args.article || 'reply' in trans_args.article || 'quote' in trans_args.article) {
                        replyFunc(context, "连续翻译不可以和其他文字选项同时出现", true);
                        return;
                    }
                    else if (trans_args.article.serialTrans.length > 5) {
                        replyFunc(context, "连烤太长会爆掉的", true);
                        return;
                    }
                    else serialTweet(context, twitter_url, trans_args);
                }
                else cook(context, twitter_url, trans_args);
            }
        });
    } catch(err) {
        console.error(err);
        replyFunc(context, "出错惹");
    }
}

function prepare(context) {
    try {
        const group_id = context.group_id;
        const num = /\d{1,3}/.exec(context.message)[0];
        if (num == 0) {
            replyFunc(context, "不要乱搞啊这从1开始计数的", true);
            return;
        }
        mongodb(DB_PATH, {useUnifiedTopology: true}).connect().then(async mongo => {
            const twe_sum = mongo.db('bot').collection('twe_sum');
            const summ = await twe_sum.findOne({group_id : group_id});
    
            if (!summ) replyFunc(context, "告诉管理员数据库挂了");
            else if (summ.list.length < num) replyFunc(context, "不要乱输数字！", true);
            else {
                let twitter_url = summ.list[num - 1];
                context.message = context.message.replace(num, twitter_url);
                if (/^(Twitter|推特)截图/i.test(context.message)) cook(context, twitter_url);
                else seasoning(context);
            }
            mongo.close();
        });
    }
    catch(err) {
        console.error(err);
        replyFunc(context, "出错惹", true);
    }
}

function complex(context) {
    if (connection && /^(推特|Twitter)截图\s?https:\/\/twitter.com\/.+?\/status\/\d{19}/i.test(context.message)) {
        let twitter_url = /https:\/\/twitter.com\/.+?\/status\/\d{19}/i.exec(context.message)[0];
        cook(context, twitter_url);
        return true;
    }
    else if (connection && /^(推特|Twitter)截图\s?\d{1,3}/i.test(context.message)) {
        prepare(context);
        return true;
    }
    else if (connection && /^烤制\s?https:\/\/twitter.com\/.+?\/status\/\d{19}(?:\?s=\d{1,2})?\s?[>＞]{1,2}/i.test(context.message)) {
        seasoning(context);
        return true;
    }
    else if (connection && /^烤制\s?\d{1,3}\s?[>＞]{1,2}/i.test(context.message)) {
        prepare(context);
        return true;
    }
    else if (/^保存烤制模板\s?https:\/\/twitter.com\/.+(?:\/)?[>＞].+/.test(context.message)) {
        let plain = context.message.replace(/\r\n/g, "");
        let {groups : {username, unparsed}} = /https:\/\/twitter.com\/(?<username>.+?)(?:\/status\/\d+)?[>＞](?<unparsed>.+)/.exec(plain);
        saveTemplate(context, username, unparsed);
        return true;
    }
}

module.exports = {complex, cookTweReply};
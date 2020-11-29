import { version } from './package.json';
import { CQWebSocket } from 'cq-websocket';
import config from './modules/config';
import CQ from './modules/CQcode';
import _ from 'lodash';
import minimist from 'minimist';
import broadcast from './modules/broadcast';
import bilibili from './modules/plugin/bilibili';
import twitter from './modules/plugin/twitter';
// import translate from "./modules/plugin/translate";
import tweBBQ from "./modules/plugin/tweBBQ";
import marshmallow from './modules/plugin/marshmallow';

// 常量
const setting = config.bot;
const bot = new CQWebSocket(config.cqws);

// 开始
bilibili.bilibiliReply(replyMsg);
twitter.twitterReply(replyMsg);
// translate.transReply(replyMsg);
tweBBQ.cookTweReply(replyMsg);

setTimeout(() => bilibili.checkBiliDynamic(replyMsg), 20000);
setTimeout(() => twitter.checkTwiTimeline(), 40000);

// 好友请求
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

// 加群请求
const groupAddRequests = {};
bot.on('request.group.invite', context => {
  if (setting.autoAddGroup)
    bot('set_group_add_request', {
      flag: context.flag,
      approve: true,
    });
  else groupAddRequests[context.group_id] = context.flag;
});

// 管理员指令
bot.on('message.private', (e, context) => {
  if (context.user_id != setting.admin) return;

  const args = parseArgs(context.message);

  // 允许加群
  const group = args['add-group'];
  if (group && typeof group == 'number') {
    if (typeof groupAddRequests[context.group_id] == 'undefined') {
      replyMsg(context, `将会同意进入群${group}的群邀请`);
      // 注册一次性监听器
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

  // 停止程序（利用pm2重启）
  if (args.shutdown) process.exit();
});

if (setting.enablePM) {
// 私聊
bot.on('message.private', privateAndAtMsg);
}
if (setting.enableGM) {
// 群组@
bot.on('message.group.@.me', privateAndAtMsg);
// 群组
bot.on('message.group', groupMsg);
}


// 连接相关监听
bot
  .on('socket.connecting', (wsType, attempts) => console.log(`${getTime()} 连接中[${wsType}]#${attempts}`))
  .on('socket.failed', (wsType, attempts) => console.log(`${getTime()} 连接失败[${wsType}]#${attempts}`))
  .on('socket.error', (wsType, err) => {
    console.error(`${getTime()} 连接错误[${wsType}]`);
    console.error(err);
  })
  .on('socket.connect', (wsType, sock, attempts) => {
    console.log(`${getTime()} 连接成功[${wsType}]#${attempts}`);
    if (wsType === '/api' && setting.admin > 0) {
      setTimeout(() => {
        bot('send_private_msg', {
          user_id: setting.admin,
          message: `已上线#${attempts}`,
        });
      }, 1000);
    }
  });

// connect
bot.connect();

// 通用处理
function commonHandle(e, context) {
    const args = parseArgs(context.message);
    if (args.help) {
        replyMsg(context, 'https://github.com/Ninzore/BBQ/wiki');
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

// 私聊以及群组@的处理
function privateAndAtMsg(e, context) {
    if (commonHandle(e, context)) {
        e.stopPropagation();
        return;
    }
}

// 群组消息处理
function groupMsg(e, context) {
    if (commonHandle(e, context)) {
        e.stopPropagation();
        return;
    }

    if (bilibili.bilibiliCheck(context) ||
        twitter.twitterAggr(context) ||
        marshmallow.prepare(context, replyMsg) ||
        tweBBQ.complex(context, replyMsg) 
        // translate.transEntry(context)
        ) {
        e.stopPropagation();
        return;
    }
}


/**
 * 回复消息
 *
 * @param {object} context 消息对象
 * @param {string} message 回复内容
 * @param {boolean} at 是否at发送者
 */
function replyMsg(context, message, at = false, reply = false) {
    if (typeof message !== 'string' || message.length === 0) return;
    if (context.message_type !== 'private') {
        message = `${reply ? CQ.reply(context.message_id) : ''}${at ? CQ.at(context.user_id) : ''}${message}`;
    }
    switch (context.message_type) {
        case 'private':
        return bot('send_private_msg', {
            user_id: context.user_id,
            message,
        });
        case 'group':
        return bot('send_group_msg', {
            group_id: context.group_id,
            message,
        });
        default: return;
    }
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

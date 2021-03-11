# 更新日志

## 2021

## 03/09 3.2.0
* tweBBQ:
  * Fix: class变更导致的截图不全
  * Fix: MongoDB中没有`twiBBQ`colloection的时候报错
* Translate
  * Style: 写正常点儿

## 03/08 3.1.9
* Twitter:
  * Feat: 添加config参数，可以选择是否启动Twitter Stream

## 03/07 3.1.8
* tweBBQ:
  * Feat: 处理有时会出现的全屏提醒

## 03/06 3.1.7
* tweBBQ:
  * Fix: 让video poster更加符合Twitter样式（如视频四周的黑边）
  * Change: 现在截图前总是会先检查
  * Style: 补齐变量声明

## 03/05 3.1.6
* tweBBQ:
  * Fix: 烤棉花糖时并没有正确换行

## 03/04 3.1.5
* tweBBQ:
  * Feat: 增加烤推历史的纯文字版
  * Fix: 增强稳定性，增加获取对话时的报错信息
* 修改指令:
  * pm2start -> start
  * pm2restart -> restart
  * pm2stop -> stop
  * pm2log -> log

## 03/03 3.1.3
* tweBBQ:
  * Fix: 回复时如果只有一张图，允许空行跳过

## 03/02 3.1.2
* tweBBQ:
  * Fix: 由于Twitter改动，更改quote区块selector
  * Fix: 修改选项区域的selector并增强稳定性
* config file:
  * Chore: 字段更名

## 02/27 3.1.1
* Twitter:
  * Feat: 视频内容改为用小视频形式发送 (需要后端支持，如go-cqhttp v0.9.38以上)
  * Refactor: 改几个变量名

## 02/26 3.1.0
* tweBBQ:
  * Feat: 支持抛弃单条(未)烤制tweet
  * Fix: 在未保存过模板的组里烤推，部分内容会遗留到下次
  * Refactor: 部分代码重构

## 02/25 3.0.9
* Twitter:
  * Refactor: 从Stream转发时增加错误处理
  * Fix: tweet转发失败报错时groups未定义

## 02/24 3.0.8
* tweBBQ:
  * Feat: 新增抛弃所有未/已烤制tweet

## 02/23 3.0.7
* tweBBQ:
  * Fix: `无汉化组`和`回复中无汉化组`的行为和预期不符
  * Feat: 新增说明书回应，config新增字段`bbq.helpPage`
  * Refactor: 内部BBQ_ARGS的字段名字变更，由`no_group_info`、`no_group_info_in_reply`变为`no_logo`、`no_logo_in_reply`
  
## 02/22 3.0.6
* tweBBQ:
  * Feat: 查看未烤制内容队列
  * Fix: tweet id小于15位时无法烤制（改成判断14~15位了，虽然还有更小的id但是那么早的推没人会烤所以无所谓）
  * Refactor: 适应新数据库字段格式
  * Chore: 略微修改logo位置

## 02/21 3.0.5
* Twitter:
  * Feat: 新增未烤制内容队列
  * Feat: 更多的报错内容
  * Feat: 更新重连逻辑，现在会在掉线后尝试重连3次，如全部失败会断线
  * Fix: 新增订阅后订阅列表未刷新
  * Fix: Twitter `card`内容中可能没有`description`字段导致错误
  * Chore: 数据库`bot.twe_sum`字段变化（已完成后向兼容无需手动更新）  
    由 `{count : 0, count_done : 0, list : [], today_all : [], today_raw : [], today_done : []}`  
    变为 `{count : 0, count_done : 0, list : [], rare : [], done : []}`

## 02/20 3.0.1
* tweBBQ:
  * Fix: 视频封面css错误

## 02/14 3.0.0
* tweBBQ:
  * Feat: 添加烤推历史记录
  * Feat: 烤推默认模板移动到config file
  * Feat: 现在烤过的推会保存为本地文件
  * Fix: 原推的回复和引用结构错误
  * Fix: 无法处理3位以上序列号

## 02/13 2.9.7
* Bilibili:
  * Feat: 跟进Wecab

## 02/10 2.9.6
* Twitter:
  * Feat: 新增翻译（可选项）
  * Feat: 对Twitter文字进行转义
  * Fix: 没有正确触发视频下载
  * Fix: 查看订阅时对null值未处理

## 02/06 2.9.5
* Twitter:
  * Feat: 新增视频下载（下载到本地并通过url发送，需要后端服务器如NGINX）
  * Refactor: 更好的断线重连机制
  * Fix: Twitter更新时无法正确更新数据库

## 02/02 2.9.4
* Twitter:
  * Refactor: 迁移到Twitter stream提供更低延迟的转发（添加Filtered Stream rule需要手工操作）
  * Feat: config增加twitter部分

## 01/15 2.9.3
* translate:
  * Feat: 移动到腾讯云平台，需要secretId和secretKey
  * Feat: 支持对一个人进行持续翻译

## 01/14 2.9.2
* directory structure change:
  * from ./modules/plugin to ./plugin
  * from ./modules to ./utils

## 01/11 2.9.1
* initialise:
  * Feat: 全局功能初始化
* boardcast: 该功能移除

## 01/04 2.9.0
* tweBBQ:
  * Feat: 新增"回复中logo" 和 "回复中logo大小" 两项可调整样式
  * Fix: 如果前一条使用了临时样式会导致默认模板变化
  * Refactor: 样式结构调整
  * Refactor: 烤制流程调整，现在会先完成填充模板

## 01/02 2.8.9
* tweBBQ:
  * Fix: 有时无法显示"显示隐藏内容"内的内容

## 01/01 2.8.8
* tweBBQ:
  * Refactor: 重构指令解析
  * Fix: 部分安卓机型无法正常触发换行
  * Fix: 有时页面顶端会出现返回上级一栏

## 2020

## 12/31 2.8.6
* tweBBQ:
  * Feat: 可以直接往原推中插图了
  * Fix: 略微修改指令解析

## 12/30 2.8.5
* tweBBQ:
  * Refactor: 重构指令解析
  * Feat: 新的语法格式

## 12/24 2.8.4
* tweBBQ:
  * Style: 让指令解析稍微好看一点

## 12/23 2.8.3
* tweBBQ:
  * Fix: 引用中未使用language属性造成字符异常
  * Feat: 支持一组多个烤制模板

## 12/20 2.8.2
* tweBBQ:
  * Fix: `/c`不识别颜文字中的一些符号
  * Fix: 截图时不会再请求tweet了

## 12/19 2.8.1
* tweBBQ:
  * Fix: `/c`会正确识别下划线了
  * Fix: 视频封面并没有被替换
  * Style: 一些小改动

## 12/18 2.8.0
* tweBBQ:
  * Refactor: 运行流程变化，现在会先尝试对整条tweet进行重构
  * Feat: 现在所有简略关键字会对tweet的所有内容文本起效
  * Fix: 现在在回复链和引用中的视频也会正确地替换掉封面
* twitter:
  * Feat: 给其他功能提供headers

## 12/14 2.7.0
* tweBBQ:
  * Fix: 修改了`/c`的识别范围，增加对`０-９`的识别
  * Style: 修改一小部分代码

## 12/14 2.6.9
* tweBBQ:
  * Fix: 修改了`/c`的识别范围，之前对\u2600-\u2800范围内的符号进行了过多识别，现在范围更加精确了
  * Feat: 现在对header，footer等进行删除时的容错率更大
  
## 12/12 2.6.8
* tweBBQ:
  * Fix: 修复由于由多位unicode导致的emoji错误显示
  * Fix: `/c`无法识别\u2600-\u2800的符号

## 12/10 2.6.6
* tweBBQ:
  * Fix: 尝试修复`/c`替换的字符在emoji前时出现的乱码

## 12/09 2.6.5
* tweBBQ:
  * Feat: 现在`/c`会匹配下划线和大于连续3个的相同字母或者数字

## 12/07 2.6.4
* tweBBQ:
  * Feat: 添加`/u`用于匹配链接
  * Feat: 略微修改`/c`

## 12/05 2.6.3
* tweBBQ:
  * Feat: 添加`replace`选项以及`/z`相关功能，匹配连续大于3个的字符
  * Feat: 修改`/c`匹配列表增加假名浊音、连音符号

## 12/02 2.6.2
* tweBBQ:
  * Feat: 修改`/c`匹配的符号类型

## 12/02 2.6.1
* tweBBQ:
  * Feat: 添加`插图`选项，允许使用自定义图片替换原始图片
  
## 12/01 2.6.0
* tweBBQ:
  * Feat: 添加`棉花糖`选项，自动烤制一条棉花糖并替换原图

## 11/30 2.5.6
* Marshmallow:
  * Feat: 暴露接口以供别的插件使用
  * Refactor: 调整网页样式以更加接近原版棉花糖

## 11/29 2.5.5
* Marshmallow:
  * Feat: 现在可以烤棉花糖了

## 11/27 2.5.4
* BBQ
  * Fix: 有gif时无法替换为poster
  * Feat: 获取Twitter时如果失败会catch error

## 11/22 2.5.3
* BBQ
  * Fix: 变更定位引用正文的形式
  * Feat: /字xN 现在支持 x×* 三个，以往为 *x
* Translate:
  * Refactor: 观察到潜在严重bug, 暂时移除翻译模块

## 11/22 2.5.2
* BBQ
  * Fix: Twitter改版导致的header失效
  * Refactor: /c现在不会判断假名
* CHANGELOG:
  * Docs: 更新文档风格使其更符合规范

## 11/16 2.5.1
* Translate 跟进Wecab
  * feat: 适配腾讯翻译新的鉴权机制
  * fix: 翻译文字未对特殊字符进行转义
  * feat: 暴露翻译接口以供别的引用使用

## 11/16 2.5.0
* feat: Twitter2.0

## 11/10 2.4.6
* feat: Twitter模块跟进Wecab

## 11/05 2.4.5
* feat: bilibili模块跟进Wecab

## 11/05 2.4.3
* Feat: 新增/WxN，可以将W复读N遍
* Fix: 回复或引用内出现视频时不会显示封面

## 11/04 2.4.1
* Feat: 新增/c关键字，自动识别>3个的连续字符

## 11/03 2.4.0
* Fix: 错误的style导致句首为emoji时，行宽仅有1字符
* feat: 样式改为优先判断组号，再判断名字

## 11/01 2.3.9
* Fix: 
  1. style中错误地标记display: inline-block，导致换行失败
  2. 修复正则，@并没有变蓝

## 10/30 2.3.8
* Fix: 处理视频和gif封面
* Feat: 括号内tag自动变蓝

## 10/26 2.3.7
* feat:
  1. 新增/e关键字，自动替换emoji
  2. 使用序列号快速截图
* Fix:
  1. 尝试显示隐藏内容有出错
  2. 引用区没有正确的格式
  3. 尝试修复一些格式错误

### 10/23 2.3.5
* feat: 开始对每条推文提供序列号

### 10/22 2.3.4
* feat: 
  1. 更好的错误处理
  2. 识别Twitter链接的参数

### 10/21 2.3.3
* feat: 新增 连续翻译 功能

### 10/19 2.3.2
* feat: 
  1. 处理引用时的"可能敏感消息"标签
  2. 引用时的文字位置错误

### 9/10 v2.3.1
* Fix: 组logo无法自动调整大小
* Fix: 填装组logo时有时失败

### 9/08 v2.3.0
* Feat: 会按组号安排logo了
* Fix: 未正确调用中文字库
* Refactor: 细微样式调整

### 8/29  v2.2.8
* Refactor: 回复内样式调整，代码结构调整

### 8/28  v2.2.7
* Fix: 修复临时变更模板时会遗留到下一次烤制的问题

### 8/26  v2.2.6
* Fix: 修复引用推文格式错误

### 8/23  v2.2.5
* Refactor: html结构调整

### 8/22  v2.2.4
* Feat: 支持引用

### 8/21  v2.2.3
* Feat: 删除不必要的功能

### 8/20  v2.2.2
* Feat: 会让tag和链接变蓝

### 8/19  v2.2.1
* Feat: 新增2个回复内选项：回复内无汉化组和回复内覆盖

### 8/18  v2.2.0
* Feat: 支持多重回复

### 8/16  v2.1.4
* Refactor: 稍微调整代码结构

### 8/15  v2.1.3
* Fix: 将视频改为图片，防止出现“视频无法加载”提示

### 8/11  v2.1.1
* Feat: 将汉化组文字logo大小和图片logo大小分开调整

### 8/09  v2.1.0
* Feat: 汉化组部分可以使用图片作为logo
* Feat: 增加“无汉化组”选项

### 8/07  v2.0.2
* Fix: 汉化组区块和文本区块混乱,
* Feat: 保存模板时会返回名字

### 8/05  v2.0.0
* Feat: 允许添加模板方便实用，添加几个新选项

### 8/03  v1.1.0
* Feat: 支持直接换行不用打<br>，其他css调整

### 8/02  v1.0.1
* Fix: 回复有时失效，字体大小设置失效

### 8/01  v1.0.0
* Refactr: 能用了

### 7/28  v0.0.3
* Fix: 解决多位unicode的emoji无法显示的问题

### 7/28  v0.0.2
* Fix: 回复翻译文字错位; 
* Feat: 汉化组名字大小调整

### 7/01  v0.0.1
* 创建BBQ项目

# BBQ

[Wecab](https://github.com/Ninzore/Wecab)的汉化组特化型

### 1. Twitter截图
使用Twitter/推特截图 https://twitter.com/xxxx  
可以直接产生一张截图  

### 2. Twitter烤制 
烤制https://twitter.com....(单条Twitter网址)>>这里放翻译内容  
这样就能直接生成一张带翻译的twitter截图  

高级用法（使用CSS方式装饰原Twitter）  
使用>标识，并在后面添加参数:  
1. 汉化组 (汉化组名称，会被标识在原本的‘翻译推文’处)
2. 回复 (烤制回复推时填写)
3. 字体 (对应 font-family)
4. 颜色 (对应 color)
5. 大小 (对应 font-size)
6. 装饰 (对应 text-decoration)
7. 背景 (对应 background)
8. 覆盖 (是否覆盖原文)
9. style (CSS)

注：在使用style时其他装饰语句无效  

例  
  * 烤制https://twitter.com....(单条Twitter网址)>翻译=什么什么东西+字体=Mircosoft Yahei + 大小=20px + 背景=blue + 颜色=red + 装饰=underline wavy yellow + 汉化组=测试汉化组  
  * 烤制https://twitter.com....(单条Twitter网址)>翻译=什么什么东西+style=background:#ffffff; text-shadow: 2px 2px; background-image: url("paper.gif");  
  
更高级用法（在原Twitter上直接插入html），注：在使用html时其他所有参数无效  
使用参数，并且使用>标识:  
1. group_html (‘翻译推文’处的html)
2. trans_html (汉化文本处的html)  

例
  * 烤制https://twitter.com....(单条Twitter网址)>group_html=....（汉化组部分html） + trans_html= ......（翻译部分html）

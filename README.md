## 更好的关键词回复-重制版 | pupbot-plugin-better-keywords-rebuild
## 用于自定义关键字并回复(有分群、私聊功能)

## 安装
```
/plugin add better-keywords-rebuild
```

## 启用
```
/plugin on better-keywords-rebuild
```

## 兼容性提示
* 本插件与 better-keywords 不兼容
* 本插件为 better-keywords 重制版, 功能几乎相同, 安装本插件前请卸载 better-keywords

## 指令
* `/bkw` 或 `/bkw help` -> 获取帮助
```
帮助菜单
	/bkw add <keyword> <permissonGroup> <info> -> 增加自定义回复
	/bkw rm <keyword> <permissonGroup> -> 删除自定义回复
	permissonGroup: p -> 当前群聊; u -> 所有群聊; f -> 所有私信; g -> 所有群聊和私信(全局)
```
* `/bkw about` 或 `/bkwabout` 或 `#bkwabout` -> 关于界面

## 特色
* 支持QQ发送图片并添加到回复内容中*
  > QQ发送图片可能会过期, 具体要看tx的策略
<!-- * 支持加载js脚本(自动调用main函数) *[js脚本开发文档](./jsdocxs/START.md)* -->
<!-- * 支持js脚本热加载(在调用前自动刷新) -->
<!-- * 支持js脚本使用 oicq 的 segment 等内置方法发送消息 -->
* 支持自定义提示文本(在插件安装目录`./language/<lang>.json`中)

## 配置文件详解

```json
{
    "keywords": {  // 主键(root)
        "groups": {},  // 当前群聊{ <gid(群号)>: { <key>: value: [{value: <value>, type: <type>}], extra: {}} } }
        "global-g": {}, // 全局群聊{<key>: value: [{value: <value>, type: <type>}], extra: {}}
        "global-f": {}, // 全局私聊{<key>: value: [{value: <value>, type: <type>}], extra: {}}
        "global": {} // 全局群聊和私聊{<key>: value: [{value: <value>, type: <type>}], extra: {}}
    }
}
```
<!-- * 兼容 `{<key>: <value>}`, 默认type为text(仅文本) -->

## 问题 / 不合理设定 (√代表已修复)
- [x] 在首次创建群聊项时创建群聊子键失败  (由Q '蓝衒' 提供反馈)
- [x] 在g模式下`globalFriendsValue is not defined`  (由QQ '蓝衒' 提供反馈)\
- [x] 删除用于调试的错误 `throw '这是一个错误'` (原 Line350)  (本人发现)
- [x] 修改`/bkwabout`设定以避免刷屏(`about`已移步`/bkw about`)
- [x] 使用QQ消息指令设置语言无效
- [x] 语言文件未找到
- [x] `TypeError: value.includes is not a function`

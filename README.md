## 更好的关键词回复-重制版 | pupbot-plugin-better-keywords-rebuild / kivibot-plugin-better-keywords-rebuild
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
> 现已支持 `kivibot` 和 `pupbot`, 但本插件仅在 `pupbot` 进行测试, 不保证完全兼容 `kivibot`!
* 本插件与 better-keywords 不兼容
* 本插件为 better-keywords 重制版, 功能几乎相同, 安装本插件前请卸载 better-keywords

## 指令
* `/bkw` 或 `/bkw help` -> 获取帮助
* `/bkw lang set <lang-code>` -> 设置语言 (例如 改为中文: `/bkw lang set zh-cn`)
* `/bkw add` / `rm` -> 添加 / 删除关键字 (例如 设置`test`所有群聊和人都回复`你好<换行>我在哦~`并开启模糊匹配: `/bkw add test g 你好\n我在哦~ +f`)
* `/bkw about` -> 关于界面
* `/bkw reload` 或 `rl` -> 重载插件
* `/bkw update` 或 `up` -> 检查更新

## 特色
* 支持QQ发送图片并添加到回复内容中*
  > QQ发送图片可能会过期, 具体要看tx的策略
<!-- * 支持加载js脚本(自动调用main函数) *[js脚本开发文档](./jsdocxs/START.md)* -->
<!-- * 支持js脚本热加载(在调用前自动刷新) -->
<!-- * 支持js脚本使用 oicq 的 segment 等内置方法发送消息 -->
* 支持自定义提示文本(在插件安装目录`./language/<lang-code>.json`中)

## 配置文件详解
```
{
    "keywords": {  // 主键(root)
        // 当前群聊{ <gid(群号)>: { <key>: value: [{value: <value>, type: <type>}], extra: {}} } }
        "groups": {},
        // 全局群聊{<key>: value: [{value: <value>, type: <type>}], extra: {}}
        "global-g": {},
        // 全局私聊{<key>: value: [{value: <value>, type: <type>}], extra: {}}
        "global-f": {},
        // 全局群聊和私聊{<key>: value: [{value: <value>, type: <type>}], extra: {}}
        "global": {}
    }
}
```
<!-- * 兼容 `{<key>: <value>}`, 默认type为text(仅文本) -->

## 问题 / 不合理设定 (√代表已修复)
- [x] 在首次创建群聊项时创建群聊子键失败  (由Q '蓝衒' 提供反馈)
- [x] 在g模式下`globalFriendsValue is not defined`  (由QQ '蓝衒' 提供反馈)
- [x] 删除用于调试的错误 `throw '这是一个错误'` (原 Line350)  (本人发现)
- [x] 修改`/bkwabout`设定以避免刷屏(`about`已移步`/bkw about`)
- [x] 使用QQ消息指令设置语言无效
- [x] 语言文件未找到
- [x] `TypeError: value.includes is not a function`
- [x] `ReferenceError: globalFriendsValue is not defined` (Line603 Font52)
- [x] \n 不会替换为 换行
- [x] 版本比较问题
- [x] 检查更新失效
- [x] \n \t 不会替换为 换行符 制表符
- [x] 版本重复更新(npm缓存未刷新)
- [x] 插件重载和自动更新问题

## 大版本看点
* V3.0.0 新增模糊匹配(详见`/bkw help`)
* V3.0.4 新增对 `kivibot` 支持
* V4.0.0 对语言文件进行重构, 现已完全支持多语言
* V4.0.5 新增更新提示, 修复`/bkw up`显示问题, 修复插件重载问题

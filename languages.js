const languages = {
    defualt: "en-us",
    "zh-cn": {
        "#name": ["简中", "中文简体", "chinese", "chinese (Chinese mainland)"],
        header: '〓 {pn} 〓',
        bugReport: "是谁都可能会遇到困难的...\n尝试运行函数 {0} 发生了没有预料的错误:\n{1}\n(如有需要请发送邮件至开发者 public.zhuhansan666@outlook.com 备注 {pn}:bug)",
        tips: {
            chlang: "使用 /bkw lang set <语言代号> 设置语言"
        },
        help: "帮助菜单\n\t/bkw about -> 关于信息\n\t/bkw lang [list -> 支持的语言列表;][set -> 设置指定语言(立即生效);]\n\t/bkw add <keyword> <permissonGroup> <infoPart1> <infoPart2> <...> -> 增加自定义回复\n\t/bkw rm <keyword> <permissonGroup> -> 删除自定义回复\n\tpermissonGroup: p -> 当前群聊; u -> 所有群聊; f -> 所有私信; g -> 所有群聊和私信(全局)\n\tinfo特殊内容:+f -> 开启模糊匹配 -f -> 关闭模糊匹配",
        error: "运行发生错误: {0}",
        errors: {
            missArgv: "缺少参数",
            unknownCmd: "未知的参数: {0}",
            cantEmpty: "{0} 不能为空"
        },
        warning: "警告: {0}",
        warnings: {
            sendMessage: "发送消息错误: {0}",
            somethingWrong: "[↓]一些事情导致消息发送失败[↓]\n{0}",
            cantAddGoutG: "无法在私聊添加/修改当前群聊项",
            cantRmGoutG: "无法在私聊删除当前群聊项",
            unkonwnPg: "未知的(多个)权限组: {0}"
        },
        addSuccess: "关键词 {0} (权限组: {1})添加成功",
        rmSuccess: "关键词 {0} (权限组: {1})移除成功",
        about: "感谢您使用{pn} for {0}, 本插件用于提升 keywords 功能\n作者: 爱喝牛奶の涛哥, 当前版本: {pv}\n开源地址: \n\thttps://github.com/zhuhansan666/pupbot-plugin-better-keywords-rebuild\n\thttps://www.npmjs.com/package/pupbot-plugin-better-keywords-rebuild",
        success: "{0} 成功",
        reload: "尝试重加载插件",
        reloadSuccess: "重载成功",
        reloadFailed: "重载失败, 错误见日志",
        chmHelp: "/alias add <原命令> <命令别名> => 新增命令别名\n/alias rm <原命令> <命令别名> => 删除命令别名",
        chm: {
            addSuccess: "添加命令别名成功 ({0} +=> {1})",
            rmSuccess: "删除命令别名成功 ({0} -=> {1})",
            oldCmdUndefined: "原命令 {0} 不存在",
            targetExist: "{0} 已在 {1} 别名中存在",
            targetUnexist: "{0} 不在 {1} 别名中",
        },
        updater: {
            try: "尝试更新插件 ({pv} -> {0})\n将会在更新完成后自动重载(出错会自动提示)",
            updateFailed: "更新插件时出错, 详情见错误日志",
            disableFailed: "重载插件禁用时出错: {0}",
            enableFailed: "重载插件启用时出错: {0}",
            updateSuccess: "插件更新成功, 当前版本: {pv}"
        },
        languages: {
            unknownLang: "未知的语言: {0}, 请检查输入是否正确",
            setSuccess: "设置语言成功: {0}, 已立即生效"
        }
    },
    "zh-tw": {
        "#name": ["繁中", "中文繁体", "chinese (traditional)", "chinese (Taiwan of China)", "traditional"],
        header: '〓 {pn} 〓',
        bugReport: "是誰都可能會遇到困難的...\n嘗試運行函數 {0} 發生了沒有預料的錯誤:\n{1}\n(如有需要請發送郵件至開發者 public.zhuhansan666@outlook.com 備註 {pn}:bug)",
        tips: {
            chlang: "使用 /bkw lang set <语言代号> 設置語言"
        },
        help: "幫助功能表\n\t/bkw about -> 關於資訊\n\t/bkw lang [list -> 支援的語言清單;][set -> 設定指定語言(立即生效;]\n\t/bkw add <keyword> <permissonGroup> <infoPart1> <infoPart2> <...> -> 增加自定義回復\n\t/bkw rm <keyword> <permissonGroup> -> 刪除自定義回復\n\tpermissonGroup: p -> 當前群聊; u -> 所有群聊; f -> 所有私信; g -> 所有群聊和私信(全域)\n\tinfo特殊内容:+f -> 開啟模糊匹配 -f -> 關閉模糊匹配",
        error: "執行發生錯誤: {0}",
        errors: {
            missArgv: "缺少參數",
            unknownCmd: "未知的參數: {0}",
            cantEmpty: "{0} 不能為空"
        },
        warning: "警告: {0}",
        warnings: {
            sendMessage: "發送消息錯誤: {0}",
            somethingWrong: "[↓]一些事情導致消息發送失敗[↓]\n{0}",
            cantAddGoutG: "無法在私聊添加/修改當前群聊項",
            cantRmGoutG: "無法在私聊刪除當前群聊項",
            unkonwnPg: "未知的(多個)許可權組: {0}"
        },
        addSuccess: "關鍵詞 {0} (許可權組: {1})添加成功",
        rmSuccess: "關鍵詞 {0} (許可權組: {1})移除成功",
        about: "感謝您使用{pn} for {0}, 本外掛程式用於提升 keywords 功能\n作者: 愛喝牛奶の濤哥, 當前版本: {pv}\n開源位址:\n\thttps://github.com/zhuhansan666/pupbot-plugin-better-keywords-rebuild\n\thttps://www.npmjs.com/package/pupbot-plugin-better-keywords-rebuild",
        success: "{0} 成功",
        reload: "嘗試重載入外掛程式",
        reloadSuccess: "重載成功",
        reloadFailed: "重載失敗, 錯誤見紀錄",
        chmHelp: "/alias add <原命令> <命令别名> => 新增命令別名\n/alias rm <原命令> <命令别名> => 刪除命令別名",
        chm: {
            addSuccess: "添加命令別名成功 ({0} +=> {1})",
            rmSuccess: "刪除命令別名成功 ({0} -=> {1})",
            oldCmdUndefined: "原命令 {0} 不存在",
            targetExist: "{0} 已在 {1} 別名中存在",
            targetUnexist: "{0} 不在 {1} 別名中",
        },
        updater: {
            try: "嘗試更新外掛程式 ({pv} -> {0})\n將會在更新完成後自動重載(出錯會自動提示)",
            updateFailed: "更新外掛程式時發生錯誤, 詳情見錯誤紀錄",
            disableFailed: "重載外掛程式禁用時出錯: {0}",
            enableFailed: "重載外掛程式啟用時出錯: {0}",
            updateSuccess: "外掛程式更新成功, 目前版本: {pv}"
        },
        languages: {
            unknownLang: "未知的語言: {0}, 請檢查輸入是否正確",
            setSuccess: "設置語言成功: {0}, 已立即生效"
        }
    },
    "en-us": {
        "#name": ["English", "English (United States)", "english"],
        header: "〓 {pn} 〓",
        bugReport: "Anyone may encounter difficulties...\nWhen try to run function {0}, an unexpected mistake has occurred:\n{1}\n(if necessary, please send email to developer public.zhuhansan666@outlook.com remarks {pn}: bug)",
        tips: {
            chlang: "Use /bkw lang set <language-code> to set language."
        },
        help: "Help menu\n\t/bkw about -> about information\n\t/bkw lang [list -> show languages;][set -> set language;]\n\t/bkw add <keyword> <permissonGroup> <infoPart1> <infoPart2> <...> -> to add custom reply\n\t/bkw rm <keyword> <permissonGroup> -> to remove custom reply\n\tpermissonGroup: p -> this group; u -> all groups; f -> all friends; g -> all groups and friends(global)\n\tinfo Special content :+f -> Turn on fuzzy matching -f -> Turn off fuzzy matching",
        error: "ERROR: {0}",
        errors: {
            missArgv: "missing parameter",
            unknownCmd: "Unknown argv: {0}",
            cantEmpty: "{0} could not be empty"
        },
        warning: "WARNING: {0}",
        warnings: {
            sendMessage: "Send message error: {0}",
            somethingWrong: "[↓]Something caused the message to fail[↓]\n{0}",
            cantAddGoutG: "Cannot add / modify current group chat items in private chat",
            cantRmGoutG: "Unable to delete the current group chat item in private chat",
            unkonwnPg: "Unknown (multiple) permission groups: {0}"
        },
        addSuccess: "Add keyword {0} (permisson group: {1}) success",
        rmSuccess: "Remove keyword {0} (permisson group: {1}) success",
        about: "Thanks for your using plugin {pn} for {0}, this plugin will be keywords better than better!\nAuthor: 爱喝牛奶の涛哥 / LoveMilk · BrotherTao, version: {pv}\nOpen source: \n\thttps://github.com/zhuhansan666/pupbot-plugin-better-keywords-rebuild\n\thttps://www.npmjs.com/package/pupbot-plugin-better-keywords-rebuild",
        success: "{0} successd",
        reload: "Try to reload plugin.",
        reloadSuccess: "Reload successful.",
        reloadFailed: "Reload failed: see the log to get errors.",
        chmHelp: "/alias add <old command> <command alias> => add command alias for old command\n/alias rm <old command> <command alias> => remove command alias for old command",
        chm: {
            addSuccess: "Command alias added successfully ({0} +=> {1})",
            rmSuccess: "Command alias removed successfully ({0} -=> {1})",
            oldCmdUndefined: "The old command {0} does not exist",
            targetExist: "{0} already exists in {1} alias",
            targetUnexist: "{0} is not in {1} alias",
        },
        updater: {
            try: "try to update plugin ({pv} -> {0})\nIt will auto reload when install update successful(If error in this, it will auto send message to you)",
            updateFailed: "Try to update plugin error, see the error log for details",
            disableFailed: "Reload plugin disable it error: {0}",
            enableFailed: "Reload plugin enable it error: {0}",
            updateSuccess: "Plugin update success, now version: {pv}"
        },
        languages: {
            unknownLang: "Unknown language: {0}, place check the input!",
            setSuccess: "Set language success: {0}, language took effect."
        }
    }
}

module.exports = { languages }
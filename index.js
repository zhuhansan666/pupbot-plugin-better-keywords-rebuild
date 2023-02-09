const debug = false
    // var oldVersion = false
var isUpdating = false
const fs = require('node:fs')
const os = require('node:os')
const path = require('path')
const { segment } = require("oicq")
const { name, version } = require('./package.json')
const { languages } = require('./languages')
const { changes } = require('./changes')
try {
    var { disablePlugin, enablePlugin, install, NodeModulesDir, PupPlugin, PluginDataDir, PupConf, axios } = require('@pupbot/core')
    var isKivibot = false
} catch (error) {
    var { disablePlugin, enablePlugin, install, NodeModulesDir, KiviPlugin, PluginDataDir, KiviConf, axios } = require('@kivibot/core')
    var PupConf = KiviConf // 定义Kivibot为PupConf避免引用失败
    var isKivibot = true
}

const openSourceLink = {
    pupbot: '\n\thttps://github.com/zhuhansan666/pupbot-plugin-better-keywords-rebuild\n\thttps://www.npmjs.com/package/pupbot-plugin-better-keywords-rebuild',
    kivibot: '\n\thttps://github.com/zhuhansan666/kivibot-plugin-better-keywords-rebuild\n\thttps://www.npmjs.com/package/kivibot-plugin-better-keywords-rebuild'
}
const versionApi = `https://registry.npmjs.org/${name}`
const botRoot = path.join(PluginDataDir, "../../") // 机器人根目录
const authorQQ = 3088420339

const UAheaders = {
    "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.70`
}

const config = {
    "updateAtLast": { "status": false, "success": true },
    "lang": "en-us",
    "keywords": {
        "groups": {},
        "global-g": {},
        "global-f": {},
        "global": {}
    },
    "commands": {
        '/bkw': ['/bkw'],
        // '/bkwabout': ['/bkwabout', '#bkwabout'],
        '/changeCmd': ['/chm', '/alias']
    }
}

const defaultConfig = JSON.parse(JSON.stringify(config))

var TOOLS = {
    getId: function(string, _split, keep = -1) {
        let result = []
        let splitArr = string.split(_split)
        for (let i = 0; i < splitArr.length; i++) {
            let item = splitArr[i]
            if (item.length > 0) {
                result.push(item.slice(0, item.length + keep))
            }
        }
        return result
    },
    removeInArray: function(arr, value) {
        for (let index = 0; index < arr.length; index++) {
            if (arr[index] == value) {
                delete arr[index]
            }
        }
    },
    getPluginName: function(nameFromPackageJson) {
        let _arr = nameFromPackageJson.split('-')
        _arr = _arr.slice(2, _arr.length)
        return _arr.join("-")
    },
    isAdmin: function(event, mainOnly = false) {
        if (mainOnly) {
            return plugin.admins[0] === event.sender.user_id;
        } else {
            return plugin.admins.includes(event.sender.user_id);
        }
    },
    sleep: function(ms) {
        let start = new Date().getTime()
        while (true) {
            if (new Date().getTime() - start > ms) {
                return
            }
        }
    },
    isAsyncFunc: function(func) {
        if (typeof func === "function") {
            try {
                return func[Symbol.toStringTag] === "AsyncFunction"
            } catch (_e) {
                console.log(_e.stack)
                return null
            }
        } else {
            return null
        }
    },
    isJsonObject: function(_obj) {
        try {
            if (typeof JSON.stringify(_obj) === "string") {
                return true;
            }
        } catch (e) {
            return false
        }
        return false;
    },
    startWithInArr: function(string, arr) {
        for (_item of arr) {
            if (string.slice(0, _item.length) == _item) {
                return true
            }
        }
        return false
    },
    endWithInArr: function(string, arr, length = null) {
        length = length == null ? string.length : length
        for (_item of arr) {
            if (string.slice(length - _item.length, length) == _item) {
                return true
            }
        }
        return false
    },
    getStatusCode: async function(url) {
        try {
            return await (await axios.get(url, header = UAheaders)).status
        } catch (response) {
            return response.response != undefined ? response.response.status : '请求失败'
        }
    },
    getImageLink: function(MD5) {
        return `http://gchat.qpic.cn/gchatpic_new/0/pupbot-0-${MD5.toUpperCase()}/0`
    },
    reloadConfig: function(_config, _defaultConfig) {
        let keys = Object.keys(_config)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            let value = _config[key]
            if (this.isJsonObject(value) && !value.constructor === Array) {
                if (defaultConfig[key] != undefined) {
                    Object.assign(value, defaultConfig[key])
                }
            }
        }
    },
    checkVersion: function(latest, thisVer) {
        let _arr = latest.toString().split('.')
        let _this = thisVer.toString().split('.')
        for (let i = 0; i < _arr.length; i++) {
            try {
                _arr[i] = parseInt(_arr[i])
                _this[i] = parseInt(_this[i])
            } catch (error) {
                plugin.logger.warn(`Compare version warn: ${error.stack}`)
            }
        }

        if (_this[0] > _arr[0]) {
            return true
        } else if (_this[0] == _arr[0]) {
            if (_this[1] > _arr[1]) {
                return true
            } else if (_this[1] == _arr[1]) {
                if (_this[2] >= _arr[2]) {
                    return true
                }
            }
        }

        return false
    },
    escape: function(string) {
        string = string.replace('\\n', '\n').replace('\\t', '\t')

        return string
    },
    formatLang(string, languageObj = undefined, arr = undefined, header = true) {
        if (header && languageObj && languageObj.header) {
            string = `${languageObj.header}\n${string}`
        }

        string = string.replace('{pn}', plugin.name).replace('{pv}', plugin.version)

        if (arr == undefined) {
            return string
        }

        if (typeof arr == "number" || typeof arr == "string" || typeof arr == "undefined" || typeof arr == 'boolean') {
            string = string.replace('{0}', arr)
            string = string.replace('{pn}', plugin.name).replace('{pv}', plugin.version)
            return string
        }

        try {
            for (let i = 0; i < arr.length; i++) {
                string = string.replace(`{${i}}`, arr[i])
            }
        } catch (error) {
            plugin.logger.error(error)
            string = string.replace('{0}', arr)
        }
        string = string.replace('{pn}', plugin.name).replace('{pv}', plugin.version)

        return string
    }
}

const imgExts = ['.png', '.jpg', '.jepg', '.bmp', '.gif', '.webp']
const urlHearders = ['http://', 'https://']
const permissonType = {
    'p': { code: 'groups', msg: { 'zh-cn': '当前群聊', 'en-us': 'this group', 'zh-tw': '當前群聊' } },
    'u': { code: 'global-g', msg: { 'zh-cn': '所有群聊', 'en-us': 'all groups', 'zh-tw': '所有群聊' } },
    'f': { code: 'global-f', msg: { 'zh-cn': '所有私信', 'en-us': 'all friends', 'zh-tw': '所有私信' } },
    'g': { code: 'global', msg: { 'zh-cn': '所有群聊和私信', 'en-us': 'all groups and friends(global)', 'zh-tw': '所有群聊和私信(全域)' } },
}

var Toys = {
    getTotleDownloads: async function(pkgname) {
        let _date = new Date()
        let nowDate = `${_date.getFullYear()}-${_date.getMonth() + 1}-${_date.getDate()}`
        let api = `https://api.npmjs.org/downloads/point/1970-01-01:${nowDate}/${pkgname}`
        let data = {}
        try {
            data = await (await axios.get(api, header = UAheaders)).data
        } catch (error) {}
        let downloads = data.downloads

        return downloads == undefined ? -1 : downloads
    }
}

var languageMgr = {
    find: function(name, defualt = undefined) {
        /**
         * @param name 语言名称
         * @returns 默认返回语言代号(如 zh-cn, en-us, ...), defualt不为undefined返回defualt内容
         */
        name = name.toLowerCase()
        let lang = languages[name.replace('_', '-')]
        if (lang) {
            return name
        }

        for (let key in languages) {
            let value = languages[key]
            if (value["#name"] && value["#name"].includes(name)) {
                return key
            }
        }

        return defualt ? defualt : languages.defualt // 都找不到返回默认
    }
}

var Manager = {
    _checkValueType: function(value, event) {
        try {
            value = value.toString()
        } catch (error) {
            plugin.logger.error(error)
        }
        if (value.includes('?')) { // 如果含有问号
            valueUrl = value.split('?')[0].toLowerCase()
        } else {
            valueUrl = value.toLowerCase()
        }
        if (TOOLS.endWithInArr(valueUrl, imgExts)) { // 如果是图片结尾的后缀
            if (valueUrl.slice(0, 7) == 'file://') { // 是本地文件url
                let filename = value.slice(7, value.length) // valueUrl不区分大小写, 为了Linux, 这里使用value
                let absFilename = path.isAbsolute(filename) ? filename : path.join(botRoot, filename) // 转换绝对路径
                if (fs.existsSync(absFilename) && fs.lstatSync(absFilename).isFile()) { // 文件存在且是文件而非文件夹
                    return { value: value, type: 'img-file' } // 返回内容
                }
            } else if (TOOLS.startWithInArr(valueUrl, urlHearders)) { // 是网络url
                return { value: value, type: 'img' } // 直接返回不判断, 发送消息会判断的
            }
            // 如果是疑似文件路径
            let absFilename = path.isAbsolute(value) ? value : path.join(botRoot, value) // 转换绝对路径
            if (fs.existsSync(absFilename) && fs.lstatSync(absFilename).isFile()) { // 文件存在且是文件而非文件夹
                return { value: value, type: 'img-file', } // 返回内容
            } else {
                return { value: `${value} `, type: 'text' } // 返回内容
            }
        } else if (value.slice(0, 7) == '{image:' && value[value.length - 1] == '}') { // 如果是QQ的图片
            let result = { value: [], type: 'img' }
            let imageMD5s = TOOLS.getId(value, '{image:')
            for (let i = 0; i < imageMD5s.length; i++) {
                let imageUrl = TOOLS.getImageLink(imageMD5s[i])
                result.value.push(imageUrl)
            }
            return result
        } else if (value.slice(0, 6) == "{face:" && value[value.length - 1] == "}") {
            let result = { value: [], type: 'face' }
            let faces = TOOLS.getId(value, '{face:')
            for (let i = 0; i < faces.length; i++) {
                let faceId = faces[i]
                result.value.push(faceId)
            }
            return result
        } else if (value.slice(0, 7) == "{bface:" && value[value.length - 1] == "}") {
            let result = { value: bfaceId, type: 'bface' }
            let bfaces = TOOLS.getId(value, '{bface:')
            for (let i = 0; i < bfaces.length; i++) {
                let bfaceId = bfaces[i]
                result.value.push(bfaceId)
            }
            return result
        } else if (value.slice(0, 7) == "{sface:" && value[value.length - 1] == "}") {
            let result = { value: sfaceId, type: 'sface' }
            let sfaces = TOOLS.getId(value, '{sface:')
            for (let i = 0; i < sfaces.length; i++) {
                let sfaceId = sfaces[i]
                result.value.push(sfaceId)
            }
            return result
        } else {
            if (value == '+f') {
                return { fuzzy: true }
            } else if (value == '-f') {
                return { fuzzy: false }
            }
            return { value: `${value} `, type: 'text' } // 返回内容
        }
    },
    add: function(name, values, ptype, event, extar) {
        extar = extar != undefined ? extar : {}
        let resultJson = { value: [], extra: extar }

        if (typeof values == "string") { // 如果values是string转为arr
            values = [values]
        }

        let result = []
        for (let i = 0; i < values.length; i++) {
            const item = values[i]
            let _result = this._checkValueType(item, event)
            if (_result.value != undefined && _result.type != undefined) {
                result.push(_result) // 添加_result
            } else { // 添加附加项
                for (let _key in _result) {
                    resultJson.extra[_key] = _result[_key]
                }
            }
        }

        // 遍历ptype并添加保存配置文件
        let ptypesMsg = []
        let unknownP = []
        for (let i = 0; i < ptype.length; i++) {
            keyname = permissonType[ptype[i]]
            if (keyname != undefined) {
                if (keyname.code != 'groups') {
                    resultJson.value = result
                    config.keywords[keyname.code][name] = resultJson
                    let msg = keyname.msg[config.lang]
                    ptypesMsg.push(msg != undefined ? msg : keyname.msg[defaultConfig.lang])
                } else {
                    if (event.message_type == 'group') {
                        if (config.keywords[keyname.code][event.group_id] == undefined) { // 如果群聊不存在则创建
                            config.keywords[keyname.code][event.group_id] = {}
                        }
                        resultJson.value = result
                        config.keywords[keyname.code][event.group_id][name] = resultJson
                        let msg = keyname.msg[config.lang]
                        ptypesMsg.push(msg != undefined ? msg : keyname.msg[defaultConfig.lang])
                    } else {
                        event.reply(TOOLS.formatLang(language.warning, language, language.warnings.cantAddGoutG))
                    }
                }
            } else {
                unknownP.push(ptype[i])
            }
        }
        if (unknownP.length > 0) {
            event.reply(TOOLS.formatLang(language.warning, language, TOOLS.formatLang(language.warnings.unkonwnPg, undefined, arr = unknownP.join(', '), header = false)))
        }
        return ptypesMsg.join(', ')
    },
    remove: function(name, ptype, event) {
        // 遍历ptype并添加删除配置文件
        let ptypesMsg = []
        let unknownP = []
        for (let i = 0; i < ptype.length; i++) {
            keyname = permissonType[ptype[i]]
            if (keyname != undefined) {
                if (keyname.code != 'groups') {
                    delete config.keywords[keyname.code][name]
                    let msg = keyname.msg[config.lang]
                    ptypesMsg.push(msg != undefined ? msg : keyname.msg[defaultConfig.lang])
                } else {
                    if (event.message_type == 'group') {
                        delete config.keywords[keyname.code][event.group_id][name]
                        let msg = keyname.msg[config.lang]
                        ptypesMsg.push(msg != undefined ? msg : keyname.msg[defaultConfig.lang])
                        if (JSON.stringify(config.keywords[keyname.code][event.group_id]) == "{}") {
                            delete config.keywords[keyname.code][event.group_id]
                        }
                    } else {
                        event.reply(TOOLS.formatLang(language.warning, language, ))
                    }
                }
            } else {
                unknownP.push(ptype[i])
            }
        }
        if (unknownP.length > 0) {
            event.reply(TOOLS.formatLang(language.warning, language, TOOLS.formatLang(language.warnings.unkonwnPg, undefined, arr = unknownP.join(', '), header = false)))
        }
        return ptypesMsg.join(', ')
    }
}

var Commands = {
    bkw: async function(event, params, plugin) {
        if (!TOOLS.isAdmin(event)) { // 不是管理员
            return
        }

        command = params[0]
        if (!command) {
            event.reply(TOOLS.formatLang(language.help, language))
            return
        }

        command = command.toLowerCase()
        if (command == 'add') { // 增加
            let [_, permisson, keyname] = params
            let info = (params.slice(3, params.length))
            if (!(keyname && permisson && info)) {
                event.reply(TOOLS.formatLang(language.error, language, [language.errors.missArgv]), true)
                event.reply(TOOLS.formatLang(language.help, language))
                return
            }

            if (info.length == 0) {
                event.reply(TOOLS.formatLang(language.error, language, TOOLS.formatLang(language.errors.cantEmpty, undefined, arr = "info", header = false)), true)
                event.reply(TOOLS.formatLang(language.help, language))
                return
            }

            reloadConfig()
            if (permisson == '*') {
                permisson = 'pufg'
            }
            let permissonGroups = Manager.add(keyname, info, permisson, event)
            plugin.saveConfig(config) // 保存配置文件
            event.reply(TOOLS.formatLang(language.addSuccess, language, [keyname, permissonGroups]), true)

        } else if (command == 'rm') { // 删除
            let [_, permisson, keyname] = params
            if (!(keyname && permisson)) {
                event.reply(TOOLS.formatLang(language.error, language, [language.errors.missArgv]), true)
                event.reply(TOOLS.formatLang(language.help, language))
                return
            }

            reloadConfig()
            if (permisson == '*') {
                permisson = 'pufg'
            }
            let permissonGroups = Manager.remove(keyname, permisson, event)
            plugin.saveConfig(config) // 保存配置文件
            event.reply(TOOLS.formatLang(language.rmSuccess, language, [keyname, permissonGroups]), true)

        } else if (command == 'about') { //关于
            Commands.about(event, params, plugin)

        } else if (command == 'lang') { // 语言选项
            secCommand = params[1];
            if (!secCommand) {
                event.reply(TOOLS.formatLang(language.error, language, TOOLS.formatLang(language.errors.cantEmpty, undefined, arr = ["secCommand"], header = false)), true)
                event.reply(TOOLS.formatLang(language.help, language))
                return
            }

            secCommand = secCommand.toLowerCase()
            if (secCommand == 'list') { // 支持的语言
                let string = ""
                for (let key in languages) {
                    let names = languages[key]['#name']
                    if (names != undefined) {
                        string = `${string}${names[0]}: ${key}\n`
                    }
                }
                string = string.slice(0, string.length - 2) // 去除末尾\n

                event.reply(TOOLS.formatLang(string, language), true)
            } else if (secCommand == 'set') {
                let tartgetLang = params[2]
                if (!tartgetLang) {
                    event.reply(TOOLS.formatLang(language.languages.unknownLang, language, '[undefined]'), true)
                    return
                }
                tartgetLang = tartgetLang.toLowerCase().replace('_', '-') // 目标语言(不区分大小写和_-)
                tartgetLang = languageMgr.find(tartgetLang, false)

                if (!tartgetLang) {
                    event.reply(TOOLS.formatLang(language.languages.unknownLang, language, [tartgetLang]), true)
                    return
                }

                config.lang = tartgetLang
                plugin.saveConfig(config)
                reloadlanguage()

                let tartgetLangString = ""
                try {
                    tartgetLangString = languages[tartgetLang]['#name'][0]
                } catch (error) {
                    tartgetLangString = tartgetLang
                }
                event.reply(TOOLS.formatLang(language.languages.setSuccess, language, [tartgetLangString]), true)
            } else {
                event.reply(TOOLS.formatLang(language.error, language, TOOLS.formatLang(language.errors.unknownCmd, undefined, arr = secCommand, header = false), true))
                event.reply(TOOLS.formatLang(language.help))
            }
        } else if (command == 'rl' || command == 'reload') { // 重载
            event.reply(TOOLS.formatLang(language.reload, language), true)
            let result = await Update.reloadPlugin(plugin, __dirname, false)
            if (result) {
                event.reply(TOOLS.formatLang(language.reloadSuccess, language), true)
                return
            }
            event.reply(TOOLS.formatLang(language.reloadFailed, language), true)
        } else if (command == 'up' || command == 'update') {
            event.reply(TOOLS.formatLang(language.updater.tip, language))
            Update.checker(true)
        } else {
            event.reply(TOOLS.formatLang(language.error, language, TOOLS.formatLang(language.errors.unknownCmd, undefined, command, false)))
        }
    },
    about: function(event, params, plugin) {
        event.reply(TOOLS.formatLang(language.about, language, [isKivibot ? "Kivibot" : "Pupbot", isKivibot ? openSourceLink.kivibot : openSourceLink.pupbot]))
    },
    changeCmd: function(event, params, plugin) {
        if (!TOOLS.isAdmin(event, true)) {
            return
        }

        command = params[0]
        if (!command) {
            event.reply(TOOLS.formatLang(language.error, language, TOOLS.formatLang(language.errors.cantEmpty, undefined, arr = 'command', header = false)), true)
            event.reply(TOOLS.formatLang(language.chmHelp, language))
            return
        }

        command = command.toLowerCase()
        if (command == 'add' || command == 'a') {
            oldCmd = params[1]
            target = params[2]
            if (!(oldCmd && target)) {
                event.reply(TOOLS.formatLang(language.error, language, [language.errors.missArgv]), true)
                return
            }

            if (config.commands[oldCmd] == undefined) {
                event.reply(TOOLS.formatLang(language.error, language, TOOLS.formatLang(language.chm.oldCmdUndefined, undefined, arr = oldCmd, header = false)), true)
                return
            }

            if (config.commands[oldCmd].includes(target)) {
                event.reply(TOOLS.formatLang(language.warning, language, TOOLS.formatLang(language.chm.targetExist, undefined, arr = [target, oldCmd], header = false)), true)
                return
            }

            config.commands[oldCmd].push(target)
            plugin.saveConfig(config)
            event.reply(TOOLS.formatLang(language.chm.addSuccess, language, [target, oldCmd]), true)

        } else if (command == 'remove' || command == 'rm') {
            oldCmd = params[1]
            target = params[2]
            if (!(oldCmd && target)) {
                event.reply(TOOLS.formatLang(language.error, language, [language.errors.missArgv]), true)
                return
            }
            if (config.commands[oldCmd] == undefined) {
                event.reply(TOOLS.formatLang(language.error, language, TOOLS.formatLang(language.chm.oldCmdUndefined, undefined, undefined, undefined, arr = oldCmd, header = false)), true)
                return
            }

            if (!(config.commands[oldCmd].includes(target))) {
                event.reply(TOOLS.formatLang(language.warning, language, TOOLS.formatLang(language.chm.targetUnexist, undefined, undefined, arr = [target, oldCmd], header = true)), true)
                return
            }

            TOOLS.removeInArray(config.commands[oldCmd], target)
            plugin.saveConfig(config)
            event.reply(TOOLS.formatLang(language.chm.rmSuccess, language, [target, oldCmd]), true)
        } else {
            event.reply(TOOLS.formatLang(language.error, language, TOOLS.formatLang(language.errors.unknownCmd, undefined, arr = command, header = false)), true)
            return
        }
    }
}

var Listener = {
    _sendMessageTry: async function(event, value) {
        try {
            await Listener._sendMessage(event, value)
        } catch (error) {
            plugin.logger.error(error)
            event.reply(TOOLS.formatLang(language.warning, language, TOOLS.formatLang(language.warnings.sendMessage, undefined, arr = `${error.stack}`, header = false)))
        }
    },
    _sendMessage: async function(event, value) {
        let result = []
        let errors = []

        for (let i = 0; i < value.length; i++) {
            const item = value[i];
            if (TOOLS.isJsonObject(item)) {
                if (item.type == 'img') {
                    if (item.value.constructor == Array) {
                        for (let i = 0; i < item.value.length; i++) {
                            let imageUrl = item.value[i];
                            let statusCode = await (TOOLS.getStatusCode(imageUrl))
                            if (typeof statusCode == 'number' && statusCode >= 200 && statusCode < 400) {
                                result.push(segment.image(imageUrl, headers = UAheaders))
                            } else {
                                errors.push(`Image ${imageUrl} requests failed(status code: ${statusCode}), not add to message, plece check the url before next time.`)
                                plugin.logger.warn(`Image ${imageUrl} requests failed(status code: ${statusCode}), not add to message, plece check the url before next time.`)
                            }
                        }
                    } else {
                        let statusCode = await (TOOLS.getStatusCode(item.value))
                        if (typeof statusCode == 'number' && statusCode >= 200 && statusCode < 400) {
                            result.push(segment.image(item.value, headers = UAheaders))
                        } else {
                            errors.push(`Image ${item.value} requests failed(status code: ${statusCode}), not add to message, plece check the url before next time.`)
                            plugin.logger.warn(`Image ${item.value} requests failed(status code: ${statusCode}), not add to message, plece check the url before next time.`)
                        }
                    }
                } else if (item.type == 'img-file') {
                    let filename = item.value.slice(7, item.value.length) // valueUrl不区分大小写, 为了Linux, 这里使用value
                    let absFilename = path.isAbsolute(filename) ? filename : path.join(botRoot, filename) // 转换绝对路径
                    if (fs.existsSync(absFilename) && fs.lstatSync(absFilename).isFile()) {
                        result.push(segment.image(item.value, headers = UAheaders))
                    } else {
                        errors.push(`Image ${item.value}(absPath: ${absFilename}) not found, plece check the filepath && filename before next time.`)
                        plugin.logger.warn(`Image ${item.value}(absPath: ${absFilename}) not found, plece check the filepath && filename before next time.`)
                    }
                } else if (item.type == 'face') {
                    if (item.value.constructor == Array) {
                        for (let i = 0; i < item.value.length; i++) {
                            let face = item.value[i];
                            result.push(segment.face(face))
                        }
                    } else {
                        result.push(segment.face(item.value))
                    }
                } else if (item.type == 'bface') {
                    result.push(`[暂不支持]{bface: ${item.value}}`)
                        // result.push(segment.bface(text = item.value))
                } else if (item.type == 'sface') {
                    if (item.value.constructor == Array) {
                        for (let i = 0; i < item.value.length; i++) {
                            let sface = item.value[i];
                            result.push(segment.sface(sface))
                        }
                    } else {
                        result.push(segment.sface(item.value))
                    }
                } else if (item.type == 'text') {
                    result.push(TOOLS.escape(item.value))
                } else {
                    errors.push(`Unknown value type ${item.type}`)
                    plugin.logger.warn(`Unknown value type ${item.type}`)
                }
            } else {
                errors.push(`The ${item} is not Json Object, place check the value: ${value}`)
                plugin.logger.warn(`The ${item} is not Json Object, place check the value: ${value}`)
            }
        }
        if (result.length > 0) {
            event.reply(result)
        } else {
            plugin.logger.warn(`Something cause result array empty, message can't send [info ↑]`)
            event.reply(TOOLS.formatLang(language.warning, language, TOOLS.formatLang(language.warnings.somethingWrong, undefined, arr = errors.join('\n'), header = false)))
        }
    },
    _privateMessage: async function(event, params, plugin) {
        let rawMessage = event.raw_message
        let globalFriends = config.keywords['global-f']
        for (let key in globalFriends) {
            let value = globalFriends[key]
            let extra = value.extra
            extra = extra != undefined ? extra : {}
            if (extra.fuzzy) { // 模糊匹配
                if (rawMessage.includes(key)) {
                    Listener._sendMessageTry(event, value.value)
                    return
                }
            } else {
                if (rawMessage == key) {
                    Listener._sendMessageTry(event, value.value)
                    return
                }
            }
        }

        delete globalFriends

        let global = config.keywords.global
        for (let key in global) {
            let value = global[key]
            let extra = value.extra
            if (extra.fuzzy) { // 模糊匹配
                if (rawMessage.includes(key)) {
                    Listener._sendMessageTry(event, value.value)
                    return
                }
            } else {
                if (rawMessage == key) {
                    Listener._sendMessageTry(event, value.value)
                    return
                }
            }
        }

        delete global
    },
    _groupMessage: async function(event, params, plugin) {
        let rawMessage = event.raw_message
        let groupObject = config.keywords.groups[event.group_id]
        if (groupObject != undefined) {
            for (key in groupObject) {
                let value = groupObject[key]
                let extra = value.extra
                extra = extra != undefined ? extra : {}
                if (extra.fuzzy) { // 模糊匹配
                    if (rawMessage.includes(key)) {
                        Listener._sendMessageTry(event, value.value)
                        return
                    }
                } else {
                    if (rawMessage == key) {
                        Listener._sendMessageTry(event, value.value)
                        return
                    }
                }
            }
        }

        delete groupObject

        let globalGroups = config.keywords['global-g']
        for (let key in globalGroups) {
            let value = globalGroups[key]
            let extra = value.extra
            extra = extra != undefined ? extra : {}
            if (extra.fuzzy) { // 模糊匹配
                if (rawMessage.includes(key)) {
                    Listener._sendMessageTry(event, value.value)
                    return
                }
            } else {
                if (rawMessage == key) {
                    Listener._sendMessageTry(event, value.value)
                    return
                }
            }
        }

        delete globalGroups

        let global = config.keywords.global
        for (let key in global) {
            let value = global[key]
            let extra = value.extra
            if (extra.fuzzy) { // 模糊匹配
                if (rawMessage.includes(key)) {
                    Listener._sendMessageTry(event, value.value)
                    return
                }
            } else {
                if (rawMessage == key) {
                    Listener._sendMessageTry(event, value.value)
                    return
                }
            }
        }

        delete global
    },
    _privateMessage_old: async function(event, params, plugin) {
        let rawMessage = event.raw_message
        let globalFriendsValue = config.keywords['global-f'][rawMessage]
        if (globalFriendsValue != undefined) {
            try {
                await Listener._sendMessage(event, globalFriendsValue.value)
            } catch (error) {
                plugin.logger.error(error)
            }
            return
        }

        delete globalFriendsValue

        let globalValue = config.keywords.global[rawMessage]
        if (globalValue != undefined) {
            try {
                await Listener._sendMessage(event, globalValue.value)
            } catch (error) {
                plugin.logger.error(error)
            }
            return
        }
    },
    _groupMessage_old: async function(event, params, plugin) {
        let rawMessage = event.raw_message
        let groupObject = config.keywords.groups[event.group_id]
        if (groupObject != undefined) {
            let groupValue = groupObject[rawMessage]
            if (groupValue != undefined) {
                try {
                    await Listener._sendMessage(event, groupValue.value)
                } catch (error) {
                    plugin.logger.error(error)
                }
                return
            }
            delete groupValue
        }

        delete groupObject

        let globalGroupsValue = config.keywords['global-g'][rawMessage]
        if (globalGroupsValue != undefined) {
            try {
                await Listener._sendMessage(event, globalGroupsValue.value)
            } catch (error) {
                plugin.logger.error(error)
            }
            return
        }

        delete globalGroupsValue

        let globalValue = config.keywords.global[rawMessage]
        if (globalValue != undefined) {
            try {
                await Listener._sendMessage(event, globalValue.value)
            } catch (error) {
                plugin.logger.error(error)
            }
            return
        }
    },
    main: async function(event, params, plugin) {
        if (event.message_type == 'group') {
            await Listener._groupMessage(event, params, plugin)
        } else {
            await Listener._privateMessage(event, params, plugin)
        }
    }
}

var Update = {
    checker: async function(sendMsg) {
        // if (oldVersion) { //是老旧的版本退出
        //     return
        // }
        let _bot = plugin.bot
        let mainAdmin = plugin.mainAdmin

        if (isUpdating) {
            let msg = TOOLS.formatLang(language.updater.isUpdating, language)
            plugin.logger.debug(`is updating, exit Update.checker(), msg:\n${msg}`)
            if (sendMsg) {
                _bot.sendPrivateMsg(mainAdmin, msg)
            }
            return
        }
        isUpdating = true

        plugin.logger.debug(`try to check version`)
        let latestVersion = "0.0.0"
        let { data } = await (axios.get(versionApi, headers = UAheaders))
        try {
            latestVersion = data['dist-tags'].latest
            if (debug) {
                latestVersion = "114514.1918.1" // dubug
            }
        } catch (error) {
            plugin.logger.warn(`get latest version warn: ${error.stack}`)
        }
        if (TOOLS.checkVersion(latestVersion, version)) { // 是最新版本退出
            plugin.logger.debug(`is the latest version. this: ${version} latest: ${latestVersion}`)
            if (sendMsg) {
                let msg = TOOLS.formatLang(
                    language.updater.isLatest, language
                )
                _bot.sendPrivateMsg(mainAdmin, msg)
            }
            return
        }

        config.updateAtLast.status = true // 设置上次更新为true
        config.updateAtLast.success = false // 默认失败
        plugin.saveConfig(config)

        let msg = TOOLS.formatLang(
            language.updater.try, language, latestVersion
        )
        _bot.sendPrivateMsg(mainAdmin, msg)
        plugin.logger.debug(`will update:\n${msg}`)

        try {
            let status = await Update.reInstall(name)
            if (!status) {
                isUpdating = false
                plugin.logger.warn(`↑↑↑reInstall(update) pkg failed↑↑↑`)
            } else {
                isUpdating = false
                config.updateAtLast.status = true // 设置上次更新为true
                config.updateAtLast.success = true // 更新成功
                plugin.saveConfig(config)
            }
        } catch (error) {
            isUpdating = false
            let msg = TOOLS.formatLang(
                language.updater.updateError, language, `\n${error.stack}`
            )
            try {
                _bot.sendPrivateMsg(mainAdmin, msg)
            } catch (error) {}
            plugin.logger.warn(`${language.header.replace(
                '{pn}', plugin.name
            )}\nreInstall(update) pkg warn:\n${error.stack}`)
        }

        // oldVersion = true
    },
    reInstall: async function(pkg, reload = true) {
        let result = await install(pkg)

        if (!result) {
            plugin.logger.warn(language.updater.installFailed)
            plugin.bot.sendPrivateMsg(plugin.mainAdmin, TOOLS.formatLang(language.updater.installFailed, language))
            return false
        }

        if (!reload) { // 不重加载直接退出
            return true
        }

        let status = Update.reloadPlugin(plugin, __dirname) // 重加载插件
        if (!status) {
            return false
        }

        return true
    },
    reloadPlugin: async function(pObj, ppath, _msg = true) {
        const _bot = plugin.bot
        let mainAdmin = plugin.mainAdmin
        let disableResult = await disablePlugin(_bot, PupConf, pObj, ppath)
        if (!(disableResult === true)) {
            if (!_msg) {
                return false
            }
            let msg = TOOLS.formatLang(language.updater.disableFailed, language, [disableResult])
            _bot.sendPrivateMsg(mainAdmin, msg)
            return false
        }
        let enableResult = await enablePlugin(_bot, PupConf, ppath)
        if (!(enableResult === true)) {
            if (!_msg) {
                return false
            }
            let msg = TOOLS.formatLang(language.updater.enableFailed, language, [enableResult])
            plugin.logger.error(msg)
            _bot.sendPrivateMsg(mainAdmin, msg)
            return false
        }

        return true
    }
}

if (!isKivibot) {
    var plugin = new PupPlugin(TOOLS.getPluginName(name), version)
} else {
    var plugin = new KiviPlugin(TOOLS.getPluginName(name), version)
}

var language = languages[languages.defualt]

async function hooker(event, params, plugin, func, args) {
    /**
     * 本函数用于hook错误, 在发生错误时发送错误信息到qq
     */
    let funcname = '[Unknown]'
    try {
        await func(event, params, plugin, args)
    } catch (error) {
        try {
            funcname = func.name
        } catch (err) {
            funcname = '[Unknown]'
        }
        console.log(error)
        let msg = TOOLS.formatLang(language.bugReport, language, [funcname, `${error.stack}`])
        event.reply(msg)
        plugin.logger.error(error)
        try {
            plugin.bot.sendPrivateMsg(authorQQ, `At ${new Date().getTime()}, funcname ${funcname}()\nbotQQ: ${plugin.bot.nickname} (${plugin.bot.uin})\nmainAdmin: ${await (await plugin.bot.getStrangerInfo(plugin.mainAdmin)).nickname} (${plugin.mainAdmin})\nPluginname: ${plugin.name}\nHostname: ${os.hostname()}\nSystem: ${os.platform()} ${os.release()} ${os.arch()}\nCPU: ${os.cpus()[0].model}\nMem: ${os.totalmem() / (1024 ** 3)} Gib\n${error.stack}`)
        } catch (error) {
            plugin.logger.error(error)
        }
    }
}

function reloadConfig() {
    plugin.saveConfig(Object.assign(config, plugin.loadConfig())) // 重加载配置文件
    TOOLS.reloadConfig(config, defaultConfig)
}

function reloadlanguage() {
    language = languages[languageMgr.find(config.lang)]
}

function getUpdateStatus() {
    if (config.updateAtLast) {
        if (config.updateAtLast.status) {
            return config.updateAtLast.success
        }
        return undefined
    }

    return null
}

reloadConfig()
reloadlanguage()

plugin.onMounted(async() => {
    try {
        let mainAdmin = plugin.mainAdmin
        let updateStatus = getUpdateStatus()
        if (updateStatus === undefined) { // 上次未更新
            // 什么也不干
        } else if (updateStatus === true) { // 更新成功
            let changeInfo = changes[version]
            plugin.bot.sendPrivateMsg(mainAdmin, TOOLS.formatLang(language.updater.updateSuccess, language, changeInfo != undefined ? changeInfo : ""))
        } else if (updateStatus === false) { // 更新失败
            plugin.bot.sendPrivateMsg(mainAdmin, TOOLS.formatLang(language.updater.updateFailed, language))
        } else { // 更新状态获取失败
            plugin.bot.sendPrivateMsg(mainAdmin, TOOLS.formatLang(language.updater.unknownStatus, language))
        }
        config.updateAtLast = { 'status': false, 'success': false } // 重写更新状态
        plugin.saveConfig(config)

        plugin.bot.sendPrivateMsg(plugin.mainAdmin, TOOLS.formatLang(language.welcome, language, await (Toys.getTotleDownloads(name)))) // 发送welcome信息
        plugin.cron('*/10 * * * *', () => hooker(null, null, null, Update.checker)) // check update on every ten minutes
        plugin.on('message', (event, params) => hooker(event, params, plugin, Listener.main)) // 监听者
        plugin.onCmd(config.commands['/bkw'], (event, params) => hooker(event, params, plugin, Commands.bkw)) // 用于配置的命令
            // plugin.onCmd(config.commands['/bkwabout'], (event, params) => hooker(event, params, plugin, Commands.about)) // about
        plugin.onCmd(config.commands['/changeCmd'], (event, params) => hooker(event, params, plugin, Commands.changeCmd))
    } catch (error) {
        plugin.logger.error(error)
        console.log(`At ${plugin.name}.onMounted Error: ${error.stack}`)
        plugin.bot.sendPrivateMsg(plugin.mainAdmin, `At ${plugin.name}.onMounted Error: ${error.stack}`)
    }
    setTimeout(() => {
            hooker(null, null, null, Update.checker) // check update
        }, 10000) // 延时 10秒检查更新
})

module.exports = { plugin }
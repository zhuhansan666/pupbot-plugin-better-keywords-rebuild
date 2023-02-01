const fs = require('node:fs')
const os = require('node:os')
const path = require('path')
const { segment } = require("oicq")
const { PupPlugin, PluginDataDir, axios } = require('@pupbot/core')
const { name, version } = require('./package.json')

const botRoot = path.join(PluginDataDir, "../../") // 机器人根目录

const authorQQ = 3088420339

const UAheaders = {
    "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.70`
}

var TOOLS = {
    getSupportLanguages: function() {
        try {
            let workPath = __dirname
            let files = fs.readdirSync(path.resolve(path.join(workPath, './languages')))
            let result = []
            files.forEach((filename) => {
                let fullFilename = path.join(workPath, path.join('./languages', filename))
                let _tmparr = filename.split('.')
                let ext = _tmparr[_tmparr.length - 1]
                if (fs.statSync(fullFilename).isFile() && ext.toLowerCase() == 'json') {
                    result.push(filename.replace('.json', ''))
                }
            })
            return result
        } catch (error) {
            console.log(error.stack)
            return []
        }
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
    addHeader: function(string, language) {
        return `${language.header.replace('${plugin.name}', plugin.name)}\n${string.replace('${plugin.name}', plugin.name)}`
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
    }
}

async function hooker(event, params, plugin, func, args) {
    /**
     * 本函数用于hook错误, 在发生错误时发送错误信息到qq
     */
    try {
        await func(event, params, plugin, args)
    } catch (error) {
        try {
            var funcname = func.name
        } catch (err) {
            var funcname = undefined
        }
        const msg = `〓 糟糕！${plugin.name}运行"${funcname}"发生错误, 请您坐和放宽, 下面是详细错误信息(好东西就要莱纳~) 〓\n${error.stack}\n(如有需要请发送邮件至开发者 public.zhuhansan666@outlook.com 备注 ${plugin.name}:bug)`
        event.reply(msg)
        plugin.logger.error(error)
        try {
            plugin.bot.sendPrivateMsg(authorQQ, `At ${new Date().getTime()}\nPluginname: ${plugin.name}\nHostname: ${os.hostname()}\nSystem: ${os.platform()} ${os.release()} ${os.arch()}\nCPU: ${os.cpus()[0].model}\nMem: ${os.totalmem() / (1024 ** 3)} Gib\n${error.stack}`)
        } catch (error) {
            plugin.logger.error(error)
        }
    }
}
var supportLangeuages = TOOLS.getSupportLanguages()
const imgExts = ['.png', '.jpg', '.jepg', '.bmp', '.gif', '.webp']
const urlHearders = ['http://', 'https://']
const permissonType = {
    'p': { code: 'groups', msg: '当前群聊' },
    'u': { code: 'global-g', msg: '所有群聊' },
    'f': { code: 'global-f', msg: '所有私信' },
    'g': { code: 'global', msg: '所有群聊和私信' },
}
const config = {
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
        '/changeCmd': ['/chm']
    }
}

var Manager = {
    _checkValueType: function(value, event) {
        console.log(`${value}, ${value.slice(0, 7)}, ${value[value.length -1 ]}`)
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
            try {
                let imageMD5 = value.slice(7, value.length - 1)
                let imageUrl = TOOLS.getImageLink(imageMD5)
                return { value: imageUrl, type: 'img' }
            } catch (error) {
                plugin.logger.warn(`get image MD5 error:\n${error.stack}`)
                return { value: `${value} `, type: 'text' }
            }

        } else {
            return { value: `${value} `, type: 'text' } // 返回内容
        }
    },
    add: function(name, values, ptype, event) {
        if (typeof values == "string") { // 如果values是string转为arr
            values = [values]
        }

        let result = []
        for (let i = 0; i < values.length; i++) {
            const item = values[i]
            let _result = this._checkValueType(item, event)
            result.push(_result) // 添加_result
        }
        // 遍历ptype并添加保存配置文件
        let ptypesMsg = []
        let unknownP = []
        for (let i = 0; i < ptype.length; i++) {
            keyname = permissonType[ptype[i]]
            if (keyname != undefined) {
                if (keyname.code != 'groups') {
                    config.keywords[keyname.code][name] = { value: result, extra: {} }
                    ptypesMsg.push(keyname.msg)
                } else {
                    if (event.message_type == 'group') {
                        if (config.keywords[keyname.code][event.group_id] == undefined) { // 如果群聊不存在则创建
                            config.keywords[keyname.code][event.group_id] = {}
                        }
                        config.keywords[keyname.code][event.group_id][name] = { value: result, extra: {} }
                        ptypesMsg.push(keyname.msg)
                    } else {
                        event.reply(TOOLS.addHeader(language.warning.replace('${errorStr}', '无法在私聊添加/修改当前群聊项'), language))
                    }
                }
            } else {
                unknownP.push(ptype[i])
            }
        }
        if (unknownP.length > 0) {
            event.reply(TOOLS.addHeader(language.warning.replace("${errorStr}", `未知权限组 ${unknownP.join(', ')}`), language))
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
                    ptypesMsg.push(keyname.msg)
                } else {
                    if (event.message_type == 'group') {
                        delete config.keywords[keyname.code][event.group_id][name]
                        ptypesMsg.push(keyname.msg)
                        if (JSON.stringify(config.keywords[keyname.code][event.group_id]) == "{}") {
                            delete config.keywords[keyname.code][event.group_id]
                        }
                    } else {
                        event.reply(TOOLS.addHeader(language.warning.replace("${errorStr}", '无法在私聊删除当前群聊项'), language))
                    }
                }
            } else {
                unknownP.push(ptype[i])
            }
        }
        if (unknownP.length > 0) {
            event.reply(TOOLS.addHeader(language.warning.replace("${errorStr}", `未知权限组 ${unknownP.join(', ')}`), language))
        }
        return ptypesMsg.join(', ')
    }
}

var Commands = {
    bkw: function(event, params, plugin) {
        if (TOOLS.isAdmin(event)) {
            command = params[0]
            if (command) {
                command = command.toLowerCase()
                if (command == 'add') {
                    let [_, keyname, permisson] = params
                    let info = (params.slice(3, params.length))
                    if (keyname && permisson && info) {
                        plugin.saveConfig(Object.assign(config, plugin.loadConfig())) // 重加载配置文件
                        if (permisson == '*') {
                            permisson = 'pufg'
                        }
                        let permissonGroups = Manager.add(keyname, info, permisson, event)
                        plugin.saveConfig(config) // 保存配置文件
                        event.reply(TOOLS.addHeader(language.addSuccess.replace('${keyname}', keyname).replace('${permissonGroup}', permissonGroups), language), true)
                    } else {
                        event.reply(TOOLS.addHeader(language.error.replace('${errSting}', '缺少参数'), language), true)
                        event.reply(TOOLS.addHeader(language.help, language))
                    }
                } else if (command == 'rm') {
                    let [_, keyname, permisson] = params
                    console.log(keyname, permisson)
                    if (keyname && permisson) {
                        if (permisson == '*') {
                            permisson = 'pufg'
                        }
                        plugin.saveConfig(Object.assign(config, plugin.loadConfig())) // 重加载配置文件
                        let permissonGroups = Manager.remove(keyname, permisson, event)
                        plugin.saveConfig(config) // 保存配置文件
                        event.reply(TOOLS.addHeader(language.rmSuccess.replace('${keyname}', keyname).replace('${permissonGroup}', permissonGroups), language), true)
                    } else {
                        event.reply(TOOLS.addHeader(language.error.replace('${errorStr}', '缺少参数'), language), true)
                        event.reply(TOOLS.addHeader(language.help, language))
                    }
                } else if (command == 'about') {
                    // this.about(event, params, plugin)
                    Commands.about(event, params, plugin)
                } else if (command == 'lang') {
                    secCommand = params[1];
                    if (secCommand) {
                        secCommand = secCommand.toLowerCase()
                        if (secCommand == 'list') { // 支持的语言
                            event.reply(TOOLS.addHeader(supportLangeuages.join('\n'), language), true)
                        } else if (secCommand == 'set') {
                            let tartgetLang = params[2] // 目标语言
                            if (tartgetLang && supportLangeuages.includes(tartgetLang.toLowerCase())) {
                                config.lang = tartgetLang
                                plugin.saveConfig(config)
                                event.reply(TOOLS.addHeader(`设置语言成功: ${tartgetLang}, 请重启插件\nSet language success: ${tartgetLang}, place load plugin!`, language), true)
                            } else {
                                event.reply(TOOLS.addHeader(`未知的语言: ${tartgetLang}, 请检查输入是否正确\nUnknown language: ${tartgetLang}, place check the input!`, language), true)
                            }
                        } else if (secCommand == 'update' || secCommand == 'flash') {
                            supportLangeuages = TOOLS.getSupportLanguages()
                            event.reply(TOOLS.addHeader(`刷新语言成功:\nReflush languages success:\n${supportLangeuages}`, language), true)
                        } else {
                            event.reply(TOOLS.addHeader(language.error.replace('${errorStr}', ` 未知的参数: ${secCommand}\nUnknown argv: ${secCommand}`), language), true)
                        }
                    } else {
                        event.reply(TOOLS.addHeader(language.error.replace('${errorStr}', `secCommand 不能为空\nsecCommand could not be empty`), language), true)
                    }
                } else {
                    event.reply(TOOLS.addHeader(language.error.replace('${errorStr}', `未知的参数: ${command}`), language), true)
                    event.reply(TOOLS.addHeader(language.help, language))
                }
            } else {
                event.reply(TOOLS.addHeader(language.help, language))
            }
        } else {
            event.reply(TOOLS.addHeader(language.noPermisson, language))
        }
    },
    about: function(event, params, plugin) {
        event.reply(TOOLS.addHeader(language.about.replace('${plugin.version}', plugin.version).replace('${plugin.name}', plugin.name), language))
    },
    changeCmd: function(event, params, plugin) {
        if (TOOLS.isAdmin(event, true)) {
            command = params[0]
            if (command) {
                command = command.toLowerCase()
                if (command == 'add' || command == 'a') {
                    oldCmd = params[1]
                    target = params[2]
                    if (oldCmd && target) {
                        if (config.commands[oldCmd] != undefined) {
                            if (!config.commands[oldCmd].includes(target)) {
                                config.commands[oldCmd].push(target)
                                plugin.saveConfig(config)
                                event.reply(TOOLS.addHeader(language.success.replace('${0}', `添加命令别名成功 (${oldCmd} +=> ${target})`), language))
                            } else {
                                event.reply(TOOLS.addHeader(language.warning.replace('${errorStr}', `${target} 已在 ${oldCmd} 别名中存在`), language))
                            }
                        } else {
                            event.reply(TOOLS.addHeader(language.error.replace('${errorStr}', `原命令 ${oldCmd} 不存在`), language))
                        }
                    } else {
                        event.reply(TOOLS.addHeader(language.error.replace('${errorStr}', `oldCmd targer均不能为空`), language))
                    }
                } else if (command == 'remove' || command == 'rm') {
                    oldCmd = params[1]
                    target = params[2]
                    if (oldCmd && target) {
                        if (config.commands[oldCmd] != undefined) {
                            if (config.commands[oldCmd].includes(target)) {
                                TOOLS.removeInArray(config.commands[oldCmd], target)
                                plugin.saveConfig(config)
                                event.reply(TOOLS.addHeader(language.success.replace('${0}', `删除命令别名成功 (${oldCmd} -=> ${target})`), language))
                            } else {
                                event.reply(TOOLS.addHeader(language.warning.replace('${errorStr}', `${target} 不在 ${oldCmd} 别名中`), language))
                            }
                        } else {
                            event.reply(TOOLS.addHeader(language.error.replace('${errorStr}', `原命令 ${oldCmd} 不存在`, language)))
                        }
                    } else {
                        event.reply(TOOLS.addHeader(language.error.replace('${errorStr}', `oldCmd targer均不能为空`, language)))
                    }
                } else {
                    event.reply(TOOLS.addHeader(language.error.replace('${errorStr}', `未知的命令: ${command}`, language)))
                }
            } else {
                event.reply(TOOLS.addHeader(language.chmHelp, language))
                    // event.reply(TOOLS.addHeader(language.error.replace('${errorStr}', `command 不能为空`)))
            }
        } else {
            event.reply(TOOLS.addHeader(language.noPermisson, language))
        }
    }
}

var Listener = {
    _sendMessage: async function(event, value) {
        let result = []
        let errors = []

        for (let i = 0; i < value.length; i++) {
            const item = value[i];
            if (TOOLS.isJsonObject(item)) {
                if (item.type == 'img') {
                    let statusCode = await (TOOLS.getStatusCode(item.value))
                    if (typeof statusCode == 'number' && statusCode >= 200 && statusCode < 400) {
                        result.push(segment.image(item.value, headers = UAheaders))
                    } else {
                        errors.push(`Image ${item.value} requests failed(status code: ${statusCode}), not add to message, plece check the url before next time.`)
                        plugin.logger.warn(`Image ${item.value} requests failed(status code: ${statusCode}), not add to message, plece check the url before next time.`)
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
                } else if (item.type == 'text') {
                    result.push(item.value)
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
            event.reply(TOOLS.addHeader(language.warning.replace('${errorStr}', `[↓]一些事情导致消息发送失败[↓]\n${errors.join('\n')}`), language))
        }
    },
    _privateMessage: async function(event, params, plugin) {
        let rawMessage = event.raw_message
        let globalFriendsValue = config.keywords['global-f'][rawMessage]
        if (globalFriendsValue != undefined) {
            try {
                await Listener._sendMessage(event, globalFriendsValue.value)
            } catch (error) {
                plugin.logger.error(error)
                event.reply(TOOLS.addHeader(language.warning.replace('${errorStr}', `发送消息错误:\n${error.stack}`), language))
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
                event.reply(TOOLS.addHeader(language.warning.replace('${errorStr}', `发送消息错误:\n${error.stack}`), language))
            }
            return
        }
    },
    _groupMessage: async function(event, params, plugin) {
        let rawMessage = event.raw_message
        let groupObject = config.keywords.groups[event.group_id]
        if (groupObject != undefined) {
            let groupValue = groupObject[rawMessage]
            if (groupValue != undefined) {
                try {
                    await Listener._sendMessage(event, groupValue.value)
                } catch (error) {
                    plugin.logger.error(error)
                    event.reply(TOOLS.addHeader(language.warning.replace('${errorStr}', `发送消息错误:\n${error.stack}`), language))
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
                event.reply(TOOLS.addHeader(language.warning.replace('${errorStr}', `发送消息错误:\n${error.stack}`), language))
            }
            return
        }

        delete globalGroupsValue

        let globalValue = config.keywords.global[rawMessage]
        if (globalValue != undefined) {
            try {
                await Listener._sendMessage(event, globalFriendsValue.value)
            } catch (error) {
                plugin.logger.error(error)
                event.reply(TOOLS.addHeader(language.warning.replace('${errorStr}', `发送消息错误:\n${error.stack}`), language))
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

const plugin = new PupPlugin(TOOLS.getPluginName(name), version)
plugin.saveConfig(Object.assign(config, plugin.loadConfig())) // 重加载配置文件
let filename = `./languages/${config.lang}.json`
filename = fs.existsSync(filename) && fs.lstatSync(filename).isFile() ? filename : `./languages/en-us.json`
const language = require(filename)

plugin.onMounted(() => {
    plugin.saveConfig(Object.assign(config, plugin.loadConfig())) // 重加载配置文件
    plugin.bot.sendPrivateMsg(plugin.mainAdmin, TOOLS.addHeader('使用 /bkw lang set <语言代号> 设置语言\nUse /bkw lang set <language-code> to set language.', language))
    plugin.on('message', (event, params) => hooker(event, params, plugin, Listener.main)) // 监听者
    plugin.onCmd(config.commands['/bkw'], (event, params) => hooker(event, params, plugin, Commands.bkw)) // 用于配置的命令
        // plugin.onCmd(config.commands['/bkwabout'], (event, params) => hooker(event, params, plugin, Commands.about)) // about
    plugin.onCmd(config.commands['/changeCmd'], (event, params) => hooker(event, params, plugin, Commands.changeCmd))
})

module.exports = { plugin }
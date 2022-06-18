module.exports = class extends PreCore {

    static scan(path) {
        const {readdirSync, readFileSync, existsSync} = PreCore.dependencies.fs
        const self = existsSync(path + "/self.js") ? require(path + "/self.js") : {}
        self.type = self.type || "Branch"
        const params = self.params ? self.params : self.params = {}
        const items = readdirSync(path)
        const dirs = []
        for (const item of items) {
            const [first] = item
            if (first === "." || item === "resources" || item === "self.js") {
                continue
            }
            const index = item.lastIndexOf(".")
            if (index === -1) {
                dirs.push(item)
                continue
            }
            const ext = item.substring(index + 1)
            const key = item.substring(0, index)
            if (ext === "js") {
                if (item === "source.js") {
                    continue
                }
                params[key] = require(path + "/" + key + ".js")
                continue
            }
            if (ext === "html" || ext === "scss") {
                params[key] = readFileSync(path + "/" + item, "utf8")
                continue
            }
            throw `invalid extension ${ext}`
        }
        if (dirs.length == 0) {
            return self
        }
        const branches = self.branches ? self.branches : self.branches = {}
        for (const key of dirs) {
            const branch = this.scan(path + "/" + key)
            if (key[0] === "_") {
                self.params[key.substring(1)] = branch
                continue
            }
            branches[key] = branch
        }
        return self
    }

    static getTypes() {
        const types = {}
        const modules = PreCore.core.branches.modules.branches
        for (const module in modules) {
            const items = modules[module].branches
            for (const type in items) {
                if (type in types) {
                    throw `Type ${module}.${type} already exists`
                }
                const obj = types[type] = items[type]
                obj.params = obj.params || {}
                obj.params.module = module

            }
        }
        return types

    }

    static processTypes(unordered) {
        const {types} = PreCore
        const unprocessed = Object.assign({}, unordered)
        let processing = true
        while (processing) {
            processing = false
            for (const type in unprocessed) {
                const obj = unprocessed[type]
                const {extend, module} = obj.params
                if (extend === undefined || extend in types) {
                    types[type] = obj
                    delete unprocessed[type]
                }
                else if (extend && extend in unprocessed === false) {
                    throw `Extended type ${extend} does not exist for type ${type}`
                }
                processing = true
            }
        }
    }

    static async requireClass(type) {
        const {home, types, classes} = PreCore
        const {module} = types[type].params
        classes[type] = require(`${home}/modules/${module}/${type}/source.js`)
    }

    static processModules() {
        const {types, classes, sources, dependencies} = PreCore,
            {readFileSync} = dependencies.fs
        for (const type in types) {
            let obj = types[type]
            const branches = obj.branches = obj.branches || {}
            branches.metas = branches.metas || {
                type: "Branch",
                branches: {},
            }
            obj = this.merge({}, obj)
            const handlers = branches.handlers = branches.handlers || {
                type: "Branch",
                branches: {},
            }
            handlers.branches = PreCore.merge(handlers.branches, this.getHandlers(classes[type], type))

            const  {extend, module}= obj.params
            if (extend) {
                const extendObj =  PreCore.core.branches.modules.branches[types[extend].params.module].branches[extend]
                obj = this.merge(extendObj, obj)
            }
            PreCore.core.branches.modules.branches[module].branches[type] = obj
            sources[type] = readFileSync(`${PreCore.home}/modules/${module}/${type}/source.js`, "utf8")
        }

    }

    static async requireClasses() {
        await super.requireClasses()
        this.processModules()
    }

    static diff(a, b) {
        const result = {}

        let changed
        for (const key in a) {
            if (key in b === false) {
                continue
            }
            const valueA = a[key]
            const typeA = this.typeOf(valueA)
            const valueB = b[key]
            const typeB = this.typeOf(valueB)
            if (typeA !== typeB) {
                changed = true
                if (typeB === "Object") {
                    result[key] = PreCore.merge({}, valueB)
                    continue
                }
                result[key] = valueB
                continue
            }
            if (typeB === "Object") {
                const res = PreCore.diff(valueA, valueB)
                if (res !== undefined) {
                    changed = true
                    result[key] = res
                }
                continue
            }
            if (valueA !== valueB) {
                changed = true
                result[key] = valueB
            }
        }
        for (const key in b) {
            if (key in a) {
                continue
            }
            changed = true
            const valueB = b[key]
            const typeB = this.typeOf(valueB)
            if (typeB === "Object") {
                result[key] = PreCore.merge({}, valueB)
                continue
            }
            result[key] = valueB
        }
        return changed ? result : undefined
    }

    static async start(result) {
        try {

            Object.assign(PreCore, {
                dependencies: {
                    fs: require("fs"),
                    sass: require("sass"),
                },
                types: {},
                sources: {},
            })
            PreCore.core = this.scan(PreCore.home)
            const types = this.getTypes()
            this.processTypes(types)
            await super.start(result)
        } catch (err) {
            result("reject", err)
        }
    }

    static getHandlers(cls, type) {
        const result = {}
        const handlers = Object.getOwnPropertyNames(cls)
        for (const handler of handlers) {
            const fn = cls[handler]
            if (typeof fn !== "function" || handler === "constructor") {
                continue
            }
            const source = fn.toString()
                .replace(/.*?\(/, "module.exports = (")
                .replace(/\)/, ") =>")
            //  const isAsync = source.indexOf("async") === 0
            const obj = result[handler] = {type: "Handler", params: {source, type}}
        }
        return result
    }

}
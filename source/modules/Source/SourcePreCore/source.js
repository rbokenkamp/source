module.exports = class extends PreCore {

    static async requireClasses() {
    }

    static scan(path) {
        const { readdirSync, readFileSync, existsSync } = PreCore.dependencies.fs
        if (existsSync(path) === false) {
            return
        }
        const self = existsSync(path + "/self.js") ? require(path + "/self.js") : {}
        self.type = self.type || "Branch"
        const params = self.params ? self.params : self.params = {}
        const items = readdirSync(path)
        const dirs = []
        for (const item of items) {
            const [first] = item
            if (first === "." || first === "_" || item === "resources" || item === "cert" || item === "self.js") {
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
            branches[key] = this.scan(path + "/" + key)
        }
        return self
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
            const obj = result[handler] = { type: "Handler", params: { source, type } }
        }
        return result
    }
    static loadClasses() {
        const { types, home, classes, metas, sources, dependencies } = PreCore,
            unprocessed = Object.assign({}, types),
            { readFileSync } = dependencies.fs
        let processing = true
        while (processing) {
            processing = false
            for (const type in unprocessed) {
                let obj = unprocessed[type]
                const { extend, module } = obj.params
                if (extend && extend in types === false) {
                    throw `Extend ${extend} does not exist for type ${type}`
                }

                if (extend === undefined || extend in unprocessed === false) {
                    const sourceFile = `${obj.basePath}/modules/${module}/${type}/source.js`
                    const cls = classes[type] = require(sourceFile)
                    sources[type] = readFileSync(sourceFile, "utf8")

                    const branches = obj.branches = obj.branches || {}
                    const handlers = branches.handlers = branches.handlers || {
                        type: "Branch",
                        branches: {},
                    }
                    handlers.branches = PreCore.merge(handlers.branches, this.getHandlers(cls, type))

                    branches.metas = branches.metas || {
                        type: "Branch",
                        branches: {},
                    }

                    if (extend) {
                        obj = types[type] = PreCore.core.branches.modules.branches[module].branches[type] = PreCore.merge(types[extend], obj)
                    }

                    !obj.params.isPreCore && cls.boot && cls.boot()

                    metas[type] = obj.branches.metas.branches

                    delete unprocessed[type]
                    continue
                }
                processing = true
            }
        }
    }
    static scanTypes(base, basePath) {
        const { types } = PreCore
        if (base === undefined) {
            return
        }
        const modules = base.branches
        for (const module in modules) {
            const items = modules[module].branches
            for (const type in items) {
                const obj = types[type] = items[type]
                obj.params = obj.params || {}
                obj.params.module = module
                obj.basePath = basePath
            }
        }
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

    static boot(deployment) {
        PreCore.core = this.scan(this.home)
        this.scanTypes(PreCore.core.branches.modules, this.home)
        if (deployment) {
            if (deployment) {
                PreCore.core.branches.deployment = deployment
                const { home } = deployment.params
                const modules = this.scan(home + "/modules")
                this.scanTypes("modules", home + "/modules")
            }
        }
        this.loadClasses()
    }

}
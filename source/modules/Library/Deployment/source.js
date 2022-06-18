module.exports = class extends PreCore.classes.Branch {

    static construct({self}) {
        super.construct({self})
        this.generate({self})
    }

    static addRequiredType({self}, type, reason) {
        const {required} = self
        if (type in required) {
            return
        }
        required[type] = reason
        const {types} = PreCore
        const {params, branches} = types[type]
        if (params.extend) {
            this.addRequiredType({self}, params.extend, type)
        }
        if (params.requires) {
            for (const key of params.requires) {
                this.addRequiredType({self}, key, type)
            }
        }

        if (branches && branches.metas) {
            const metas = branches.metas.branches
            for (const key in metas) {
                const obj = metas[key]
                this.addRequiredType({self}, obj.type, type)
            }
        }
    }

    static getBranchType({self}, branch) {
        const {type, branches} = branch
        this.addRequiredType({self}, type, "core")
        if (branches === undefined) {
            return
        }
        for (const key in branches) {
            this.getBranchType({self}, branches[key])
        }
    }

    static sortRequired({self}) {
        const {required} = self
        const result = {}
        const {types} = PreCore
        let processing = true
        while (processing) {
            processing = false
            for (const type in required) {
                const obj = types[type],
                    {extend} = obj.params
                if (extend === undefined || extend in result) {
                    result[type] = required[type]
                    delete required[type]
                    continue
                }
                processing = true
            }
        }
        self.required = result
    }

    static getRequiredTypes({self}) {
        const {type, params} = self
        const {core, requires} = params
        const result = self.required = {PreCore: "always"}
        for (const key of requires) {
            this.addRequiredType({self}, key, type)
        }

        this.getBranchType({self}, core)
        this.sortRequired({self})
    }

    static generate({self}) {
        this.getRequiredTypes({self})
        this.generateClasses({self})
        this.generateTypes({self})
        this.generateCore({self})
    }

    static generateClasses({self}) {
        const {sources, dependencies} = PreCore
        const {existsSync, writeFileSync, mkdirSync} = dependencies.fs
        const {params, required} = self
        const {home} = params
        const classesHome = `${home}/classes`
        if (existsSync(classesHome)) {
            this.deleteClasses({self}, classesHome)
        } else {
            mkdirSync(classesHome)
        }
        for (const type in required) {
            writeFileSync(classesHome + "/" + type + ".js", this.getSource(type, sources[type]))
        }
    }

    static extractObj(obj) {
        const {type, params, branches} = obj
        const result = {
            type
        }
        const p = result.params = PreCore.merge(params)

        if (type === "Handler" && !params.isAsync) {
            return
        }
        delete p.key
        delete p.path
        delete p.id
        if (type === "Type") {
            delete p.module
        } else if (type === "Handler") {
            delete p.source
            delete p.type
        }

        if (branches) {
            const b = result.branches = {}
            for (const key in branches) {
                const res = this.extractObj(branches[key])
                if (res) {
                    b[key] = res
                }
            }
         }

        return result
    }

    static generateTypes({self}) {
        const {required, params} = self
        const {home} = params
        const {writeFileSync} = PreCore.dependencies.fs
        const types = {}
        for (const type in required) {
            if (type.indexOf("PreCore") !== -1) {
                continue
            }
            const extract = this.extractObj( PreCore.types[type])
            if (extract) {
                types[type] = extract
            }
        }

        const keys = Object.keys(types).reverse()
        for (const type of keys) {
            const obj = types[type],
                {extend} = obj.params

            if (extend) {
               types[type] = PreCore.diff(types[extend], obj)
            }

        }

        writeFileSync(home + "/types.js", "PreCore.types = " + JSON.stringify(types))
    }

    static generateCore({self}) {
        const {home, core} = self.params
        const {writeFileSync} = PreCore.dependencies.fs
        writeFileSync(home + "/core.js", "PreCore.core = " + JSON.stringify(core))
    }

    static getSource(type, source) {
        return source
    }

    static deleteClasses({self}, classesHome) {
        const {readdirSync, unlinkSync} = PreCore.dependencies.fs
        const items = readdirSync(classesHome)
        for (const item of items) {
            if (item[0] === ".") {
                continue
            }
            const index = item.lastIndexOf(".")
            if (index === -1 || item.substring(index + 1) !== "js") {
                continue
            }
            unlinkSync(classesHome + "/" + item)
        }

    }
}
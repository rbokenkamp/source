module.exports = class {
    static exec({result}, {self, handler, arg}) {
        const {types, classes} = PreCore
        const {type} = self

        if (!types[type]) {
            return result("reject", new Error(`Type ${type} does not exist for ${self.params.path}`))
        }
        const handlerObj = PreCore.get(types[type], "branches/handlers/branches/"+handler)
        let isAsync
        if (handlerObj !== undefined) {
            isAsync = handlerObj.params.isAsync
        }
        try {
            const arg2 = arg || []
            if (isAsync) {
                classes[type][handler]({self, result}, ...arg2)
            } else {
                const output = classes[type][handler]({self}, ...arg2)
                result && result("resolve", output)
                return output
            }
        } catch (err) {
            if (result) {
                return result("reject", err)
            }
            throw err
        }
    }

    static get (obj, path) {
        const parts = path.split("/")
        let current = obj
        for (const key of parts) {
            current = current[key]
            if (current === undefined) {
                return
            }
        }
        return current
    }

    static sequence({result}, ...sequence) {
        PreCore.depth++
        if (PreCore.depth === 500) {
            PreCore.depth = 0
            return setTimeout(() => this.sequence({result}, ...sequence))
        }
        const next = sequence.shift()
        const res = (action, data) => {
            if (action === "reject") {
                return result("reject", data)
            }
            if (sequence.length === 0) {
                return result("resolve")
            }
            this.sequence({result}, ...sequence)
        }
         this.exec({result: res}, next)
    }

    static instanceOf(a, b) {
        const {types} = PreCore
        while (a) {
            if (a === b) {
                return true
            }
            a = types[a].params.extend
        }
    }

    static typeOf(value) {
        if (value === null) {
            return "null"
        }
        const type = typeof (value)
        if (type === "object") {
            return value.constructor.name || "Object"
        }
        return type
    }

    static merge(a, b) {
        a = a || {}
        b = b || {}
        const result = {}

        for (const key in a) {
            if (key[0] === "_") {
                continue
            }
            const valueA = a[key]
            const typeA = this.typeOf(valueA)
            if (key in b === false) {
                if (typeA === "Object") {
                    result[key] = this.merge(valueA)
                    continue
                }
                result[key] = valueA
                continue
            }

            const valueB = b[key]
            const typeB = this.typeOf(valueB)
            if (typeB !== "Object") {
                result[key] = valueB
                continue
            }
            result[key] = this.merge(typeA === "Object" ? valueA : {}, valueB)
        }

        for (const key in b) {
            if (key[0] === "_") {
                continue
            }
            if (key in a === true) {
                continue
            }
            const valueB = b[key]
            const typeB = this.typeOf(valueB)
            if (typeB !== "Object") {
                result[key] = valueB
                continue
            }
            result[key] = this.merge({}, valueB)
        }
        return result
    }

    static initTypes() {
        const {types, metas} = PreCore
        for (const key in types) {
            let obj = types[key]
            const params = obj.params || {}
            const {extend} = params
            if (extend) {
                if (extend in types === false) {
                    throw new Error(`Extended type ${extend} does not exist for /types/${type}`)
                }
                obj = types[key] = this.merge(types[extend], obj)
            }
            metas[key] = obj.branches.metas.branches
        }
    }

    static bootTypes() {
        const {classes} = PreCore
        for (const key in classes) {
            const cls = classes[key]
            cls.boot && cls.boot()
        }
    }

    static async start(result) {
        try {
            PreCore.classes = {}
            PreCore.metas = {}
            PreCore.instances = {}
            PreCore.depth = 0
            await this.requireClasses()
            this.initTypes()
            this.bootTypes()

            PreCore.exec({result}, {self: PreCore.core, handler: "instance"})
        } catch (err) {
            result("reject", err)
        }
    }

    static async requireClasses() {
        const {types} = PreCore
        for (const type in types) {
            await this.requireClass(type)
        }
    }


}
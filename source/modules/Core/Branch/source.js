module.exports = class {

    static construct({self}) {
        const {params} = self
        this.validate({self})
        PreCore.instances[self.params.id] = self
    }


    static extract({self}) {
        const {type, params, branches} = self
        const p = {}
        const metas = PreCore.metas[type]
        for (const key in metas) {
            if (self !== PreCore.core && key === "path" || key === "key") {
                continue
            }
            if (key in params) {
                p[key] = params[key]
            }
        }
        const result = {
            type, params: p
        }

        if (branches === undefined) {
            return result
        }
        const extractBranches = result.branches = {}
        for (const key in branches) {
            const res = PreCore.exec({}, {self: branches[key], handler: "extract"})
            if (res) {
                extractBranches[key] = res
            }
        }
        return result
    }

    static validate({self}) {
        const {type, params} = self,
            {types, classes} = PreCore,
            {path} = params

        const metas = PreCore.metas[type]
        for (const key in params) {
            if (key in metas === false) {
                throw new Error(`Param ${path + "." + key} does not exist`)
            }
        }

        for (const key in metas) {
            const obj = metas[key],
                {type} = obj

            if (type in types === false) {
                throw new Error(`Type ${type} does not exist for path [/metas/${key}]`)
            }
            const cls = classes[type]

            const value = cls.validateParam({self: obj}, path + "." + key, params[key])
            if (value === undefined) {
                delete params[key]
                continue
            }
            params[key] = value
        }

    }

    static _set({self}, key, value) {
        const {type, params} = self
        const metas = PreCore.metas[type]
        if (key in metas === false) {
            throw new Error(`Param ${path + "." + key} does not exist`)
        }
        const obj = metas[key]
        const {updatable, handler} = obj.params
        if (!updatable) {
            throw `${params.path + "." + key} is not updatable`
        }
        const cls = PreCore.classes[obj.type]
        value = cls.validateParam({self: obj}, params.path + "." + key, value)

        if (cls.equals(value, params[key])) {
            return
        }
        params[key] = value
        if (handler) {
            this[handler]({self})
        }
        return true
    }

    static set({self}, path, value) {
        const index = path.indexOf("/")
        const index2 = path.indexOf(".")
        if (index === -1 && index2 <= 0) {
            if (path[0] === ".") {
                return this._set({self}, path.substring(1), value)
            }
            throw "Not yet able to set branch"
        }
        let key, remain
        if (index === -1 || index2 < index) {
            key = path.substring(0, index2)
            remain = path.substring(index2)
        } else {
            key = path.substring(0, index)
            remain = path.substring(index + 1)
        }

        if ((!self.branches) || (key in self.branches === false)) {
            throw `Invalid path ${path}`
        }
        PreCore.exec({}, {self: self.branches[key], handler: "set", arg: [remain, value]})
    }

    static get({self}, path) {
        const index = path.indexOf("/")
        const index2 = path.indexOf(".")
        if (index === -1 && index2 <= 0) {
            if (path[0] === ".") {
                return self.params[path.substring(1)]
            }
            return self.branches ? self.branches[path] : undefined
        }
        let key, remain
        if (index === -1 || index2 < index) {
            key = path.substring(0, index2)
            remain = path.substring(index2)
        } else {
            key = path.substring(0, index)
            remain = path.substring(index + 1)
        }
        if ((!self.branches) || (key in self.branches === false)) {
            throw `Invalid path ${path}`
        }
        return PreCore.exec({}, {self: self.branches[key], handler: "get", arg: [remain]})
    }

    static prepareInstance({self}, branch) {
        const {branches} = branch,
            {path} = branch.params

        if (branches) {
            for (const key in branches) {
                const child = branches[key]
                const params = child.params = child.params || {}
                params.key = key
                params.path = path + "/" + key
                child.parent = branch
                this.prepareInstance({self}, child)
            }
        }

    }

    static instance({self, result}) {
        this.prepareInstance({self}, self)
        const {type} = self
        const parts = [
            {self, handler: "signal", arg: ["construct"]},
            {self, handler: "signal", arg: ["open"]},
        ]
        if (typeof window) {
            parts.push({self, handler: "signal", arg: ["draw"]})
        }
        PreCore.sequence({result},
            ...parts
        )

    }

    static signal({self, result}, handler, arg, options) {
        result = result ? result : (action, data) => {
            if (action === "reject") {
                console.error("REJECT", data)
            }
        }
        const stack = []
        const {reverse, childrenOnly} = options || {}

        if (!reverse && !childrenOnly && handler in this) {
            stack.push({self, handler})
        }
        const {branches} = self
        if (branches) {
            const keys = reverse ? Object.keys(branches).reverse() : Object.keys(branches)
            for (const key of keys) {
                stack.push({self: branches[key], handler: "signal", arg: [handler, arg, {reverse}]})
            }
        }
        if (reverse && !childrenOnly && handler in this) {
            stack.push({self, handler})
        }
        if (stack.length) {
            return PreCore.sequence({result}, ...stack)
        }

        result("resolve")
    }
}
module.exports = class extends PreCore.classes.Param {
    static validateParam({self}, path, data) {
        data = super.validateParam({self}, path, data)
        if (data === undefined) {
            return
        }
         const type = PreCore.typeOf(data)
        if (type !== "Array") {
            throw new Error(`${path} must be array`)
        }
        return data
    }

    static equals(a, b) {
        if (a.length !== b.length) {
            return false
        }
        const {classes} = PreCore
        for (const i in a) {
            const valueA = a[i]
            const valueB = b[i]
            const typeA = PreCore.typeOf(a)
            const typeB = PreCore.typeOf(b)
            if (typeA!== typeB) {
                return false
            }
            if (typeA === "Object") {
                const result = classes.Object.equals(valueA, valueB)
                if (!result) {
                    return false
                }
                continue
            }
            if (typeA === "Array") {
                const result =this.equals(valueA, valueB)
                if (!result) {
                    return false
                }
                continue
            }
            if (valueA !== valueB) {
                return false
            }

        }
        return true
    }
}
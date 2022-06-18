PreCore.classes.Object = class extends PreCore.classes.Param {
    static validateParam({self}, path, data) {
        data = super.validateParam({self}, path, data)
        if (data === undefined) {
            return
        }
        const type = PreCore.typeOf(data)
        if (type !== "Object") {
            throw new Error(`${path} must be object`)
        }
        return data
    }

    static equals(a, b) {
        const {classes} = PreCore
        for (const key in a) {
            if (key in b === false) {
                return false
            }
            const valueA = a[key]
            const valueB = b[key]
            const typeA = PreCore.typeOf(a)
            const typeB = PreCore.typeOf(b)
            if (typeA !== typeB) {
                return false
            }
            if (typeA === "Object") {
                const result = this.equals(valueA, valueB)
                if (!result) {
                    return false
                }
                continue
            }
            if (typeA === "Array") {
                const result = classes.Array.equals(valueA, valueB)
                if (!result) {
                    return false
                }
                continue
            }
            if (valueA !== valueB) {
                return false
            }

        }
        for (const key in b) {
            if (key in a === false) {
                return false
            }
        }
        return true
    }

}
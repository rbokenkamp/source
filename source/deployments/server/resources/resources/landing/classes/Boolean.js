PreCore.classes.Boolean = class extends PreCore.classes.Param {
    static validateParam({self}, path, data) {
        data = super.validateParam({self}, path, data)
        if (data === undefined) {
            return
        }
        const type = typeof (data)
        if (type !== "boolean") {
            throw new Error(`${path} must be boolean`)
        }
        return data
    }

}
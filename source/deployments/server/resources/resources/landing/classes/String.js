PreCore.classes.String = class extends PreCore.classes.Param {
    static validateParam({self}, path, data) {
        data = super.validateParam({self}, path, data)
        if (data === undefined) {
            return
        }
        const type = typeof (data)
        if (type !== "string") {
            throw new Error(`${path} must be string`)
        }
        const {min, max, length} = self.params
        if (min !== undefined && data.length < min) {
            throw new Error(`${path} must be at least ${min} characters`)
        }
        if (max !== undefined && data.length > max) {
            throw new Error(`${path} must be at most ${max}`)
        }
        if (length !== undefined && data.length !== length) {
            throw new Error(`${path} must be ${length} long`)

        }
        return data
    }

}
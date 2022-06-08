module.exports = class extends PreCore.classes.Param {
    static validateParam({self}, path, data) {
        data = super.validateParam({self}, path, data)
        if (data === undefined) {
            return
        }
        const type = typeof (data)
        if (type !== "number" && data % 1 === 0) {
            throw new Error(`${path} must be integer`)
        }
        const {min, max} = self.params
        if (min !== undefined && data < min) {
            throw new Error(`${path} must be at least ${min}`)
        }
        if (max !== undefined && data > max) {
            throw new Error(`${path} must be at most ${max}`)
        }
        return data
    }
}
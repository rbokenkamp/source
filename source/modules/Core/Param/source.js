module.exports = class extends PreCore.classes.Branch {

    static validateParam({self}, path, data) {
        const params = self.params = self.params || {}
        if (data === undefined) {
            if (params.default) {
                data = params.default
            }
            if (data === undefined && params.required) {
                throw new Error(`${path} is required`)
            }
        }
        return data
    }

    static equals(a, b) {
        return a === b
    }

}
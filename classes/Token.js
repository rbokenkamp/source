module.exports = class extends PreCore.classes.String {

    static boot() {
        this.chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    }

    static generate(n) {
        let result = ""
        const {chars} = this
        const {random, floor} = Math
        const {length} = chars
        for (let i=0; i<n; i++) {
            result += chars[floor(random()*length)]
        }
        return result
    }

    static validateParam({self}, path, data) {
        if (data === undefined) {
            const {length} = self.params
            data = this.generate(length || 33)
        }
        return super.validateParam({self}, path, data)
    }

}
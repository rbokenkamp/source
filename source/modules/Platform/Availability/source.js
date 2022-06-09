module.exports = class extends PreCore.classes.Branch {

    static getData({ self }) {
        const { branches } = self
        const result = {}
        for (const product in branches) {
            result[product] = true
            const branch = branches[product]
            for (const key in branch.branches) {
                if (branch.branches[key].success !== true) {
                    result[product] = false
                    break
                }
            }
        }
        return result
    }

    static opened({ self }) {
        console.log("OPENED")
        const data = this.getData({ self })
        console.log(data)
    }
}
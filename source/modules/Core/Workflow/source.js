module.exports = class extends PreCore.classes.Worker {
    static open({ self }) {
        const { params, branches } = self,
            { sequence } = params

        if (sequence) {
            let prev
            for (const part of sequence) {
                if (prev) {
                    branches[prev].next = branches[part]
                }
                prev = part
            }
        }
        console.log(sequence)
    }
}
module.exports = class extends PreCore.classes.Branch {


    static input({ self }, params) {
        this.output({ self }, params)
    }

    static output({ self }, params) {
        if (self.next) {
            PreCore.classes[self.next.type].input({self: self.next}, params)
        }
    }
}
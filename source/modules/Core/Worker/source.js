module.exports = class extends PreCore.classes.Branch {


    static input({ self , output}, data) {
        output(data)
    }

    static output({ self }, data) {
        const {key} = self.params
        PreCore.exec({}, {self: self.parent,
            handler: "handleOutput",
            arg: [key, data],
        })
    }
}
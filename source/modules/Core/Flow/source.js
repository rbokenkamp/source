module.exports = class extends PreCore.classes.Worker {

    static handleOutput({self}, key, data) {
        console.log("OUTPUT", key, data)
        const output = () => console.log("@@@@@@@@@@@")
        PreCore.exec({output}, {
            self: self.branches[key],
            handler: "input",
            arg: [data]
        })
    }

    static parseFlow({self}) {
        const {flow} = self.params
        console.log("FLOW", flow)
    }

    static open({self}) {
        const {params, branches} = self,
            {flow} = params

        this.parseFlow({self})
    }
}
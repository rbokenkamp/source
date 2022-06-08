module.exports = class extends PreCore.classes.Deployment {

    static generate({self}) {
        super.generate({self})
        this.generateDependencies({self})
    }

    static generateDependencies({self}) {
        const {required} = self
        const {types} = PreCore
        const {home} = self.params
        self.dependencies = {}
        for (const type in required) {
            const {dependencies} = types[type].params
            if (dependencies) {
                for (const key in dependencies) {
                    self.dependencies[key] = `require('${dependencies[key]}')`
                }
            }
        }

        const content = JSON.stringify(self.dependencies).replace(/\"require\(\'(.*?)\'\)\"/g, (_, name) => `require("${name}\")`)
        const {writeFileSync} = PreCore.dependencies.fs
        writeFileSync(home + "/dependencies.js", "PreCore.dependencies = " + content)

    }
}

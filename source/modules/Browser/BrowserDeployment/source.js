module.exports = class extends PreCore.classes.Deployment {

    static extractObj(obj) {
        const {renderSync} = PreCore.dependencies.sass
        let result = super.extractObj(obj)
        if (result === undefined) {
            return
        }
        if (result.params.style) {
            const options = {data: result.params.style, includePaths: []}
            result.params.style = renderSync(options).css.toString("utf8")
        }
        return result
    }

    static getSource(type, source) {
        if (type.indexOf("PreCore") === -1) {
            return source.replace("module.exports = ", `PreCore.classes.${type} = `)
        }
        if (type === "PreCore") {
            return source.replace("module.exports = ", `let PreCore = `)
        }
        return source.replace("module.exports = ", `PreCore = `)
    }

}

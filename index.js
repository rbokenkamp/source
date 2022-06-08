module.exports = deployment => {
    const home = __dirname + "/source"
    global.PreCore = require(`${home}/modules/Core/PreCore/source.js`)
    global.PreCore = require(`${home}/modules/Source/SourcePreCore/source.js`)
    Object.assign(PreCore, {
        dependencies: {
            fs: require("fs"),
            http: require("http"),
            https: require("https"),
            ws: require("ws"),
            json2yaml: require("json2yaml"),
            yamljs: require("yamljs"),
            sass: require("sass"),
        },
        sources: {},
        instances: {},
        types: {},
        metas: {},
        home,
        classes: {},
        depth: 0,
    })

    PreCore.boot()

    const result = (action, data) => {
        if (action === "reject") {
            return console.error("REJECT", data)
        }
        console.log("RESOLVE", data)
        const core = PreCore.exec({}, {self: PreCore.core, handler: "extract"})
    }

    PreCore.core.branches.deployment = deployment
    PreCore.exec({result}, {self: PreCore.core, handler: "instance"})
}
module.exports = class extends PreCore.classes.Branch {

    static translate(yaml) {
      //  const {parse, stringify}
        return PreCore.dependencies.yamljs.parse(yaml)
    }

}
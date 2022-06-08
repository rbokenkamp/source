module.exports = class extends PreCore.classes.Branch {

    static translate(script, spaces) {
       return PreCore.dependencies.json2yaml.stringify(script)
  //      return PreCore.dependencies.yamljs.stringify(script, spaces || 4)
    }

}
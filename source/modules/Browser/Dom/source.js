module.exports = class extends PreCore.classes.Branch {

  static findNode(node, verify) {
      while(node!== document) {
          if (verify(node)) {
              return node
          }
          node = node.parentNode
      }
  }
  static getAttributes(node, prefix) {
      prefix = prefix || ""
      const {attributes} = node
      const result = {}
      for (let i=0; i<attributes.length; i++) {
          let {name, value} = attributes[i]
          if (prefix) {
              if (name.indexOf(prefix)!==0) {
                  continue
              }
              name = name.substring(prefix.length)
          }
          result[name] = value

      }
      return result
  }

}

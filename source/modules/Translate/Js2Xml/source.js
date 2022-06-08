module.exports = class extends PreCore.classes.Branch {

    static translate(obj, spaces, key, level) {
        spaces = spaces || 4
        level = level || 0
        const {type, branches} = obj
        let paramsXml = ""
        const params = obj.params || {}
        if (key) {
            params.key = key
        }

        let attributes = []
        for (const key in params) {
            let value = params[key]
            const typeOf = PreCore.typeOf(value)
            if (typeOf === "Array" || typeOf === "Object") {
                value = JSON.stringify(value)
            }
            value = "" + value
            const encoded = encodeURI(value)
            if (encoded !== value) {
                attributes.push([key, value])
                continue
            }
            paramsXml += ` ${key}="${encoded}"`
        }
        const prefix = " ".repeat(level * spaces)
        const prefix2 = " ".repeat((level + 1) * spaces)
        let xml = `${prefix}<${type}${paramsXml}>`
        let innerXml = ""
        if (attributes) {
            for (const [key, value] of attributes) {
                innerXml += `${prefix2}<attribute key="${key}"><![CDATA[${value}]]></attribute>\n`
            }
        }

        if (branches) {
            for (const key in branches) {
                innerXml += this.translate(branches[key], spaces, key, level + 1)
            }
        }

        if (innerXml) {
            xml += "\n" + innerXml + `${prefix}</${type}>\n`
        } else {
            xml += `</${type}>\n`
        }
        return xml
    }
}
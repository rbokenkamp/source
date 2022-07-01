module.exports = class extends PreCore.classes.Worker {

    static parseQuery(query) {
        const result = {}
        if (!query) {
            return result
        }
        const parts = query.split("&")
        for (const part of parts) {
            const index = part.indexOf("=")
            if (index === -1) {
                continue
            }
            const key = part.substring(0, index)
            const value = decodeURIComponent(part.substring(index+1))
            result[key] = value
        }
        return result
    }
    static parsePath(path) {
        const index = path.indexOf("?")
        let queryString
        if (index !== -1) {
            queryString = path.substring(index+1)
            path = path.substring(0, index)
        }

        if (path.indexOf(".") === -1) {
            path = (path === "/" ? "" : "/")+"index.html"
        }
        return {
            path,
            query: this.parseQuery(queryString)
        }
    }
}

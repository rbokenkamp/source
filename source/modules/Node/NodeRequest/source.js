module.exports = class {

    static request(params, result) {
        const {secure, hostname, port, method, path} = params
        const {request} = PreCore.dependencies[secure ? "https" : "http"]
        const options = {
            hostname,
            port,
            method,
            path,
        };

        let resolved
        const req = request(options, res => {
            const {statusCode} = res
            if (statusCode !== 200) {
                return result("reject", new Error(`Request failed with status code ${statusCode}`))
            }

            let content = ""
            res.on("data", chunk => {
                content += chunk
            })
            res.on("end", () => {
                resolved = true
                resolve(content)
            })

        });

        let timeout
        setTimeout(() => {
            timeout = true
            req.destroy()
        }, 1000)

        req.on("error", err => {
            if (timeout) {
                return
            }
            if (resolved) {
                return console.error("ERROR", err)
            }
            result("reject", new Error(err))
        });

    }

}
module.exports = class extends PreCore.classes.Branch {

    static request(params, result) {
        let { secure, hostname, port, method, path, timeout } = params
        method = method || "get"
        path = ""
        timeout = timeout || 3000
        const { request } = PreCore.dependencies[secure ? "https" : "http"]
        const options = {
            hostname,
            port,
            method,
            path,
            rejectUnauthorized: false,
        }

        let resolved
        const req = request(options, res => {
            const { statusCode } = res
        //    if (statusCode !== 200) {
        //        return result("reject", new Error(`Request failed with status code ${statusCode}`))
        //    }
            let content = ""
            res.on("data", chunk => {
                content += chunk.toString("utf8")
            })
            res.on("end", () => {
                resolved = true
                clearTimeout(timeoutId)
                result("resolve", content)
            })

        });

        let isTimeout
        const timeoutId = setTimeout(() => {
            console.log(timeout, "timeout")
            isTimeout = true
            req.destroy()
        }, timeout)

        req.on("error", err => {
            if (isTimeout) {
                return result("reject", new Error("Timeout"))
            }
            if (resolved) {
                return console.error("ERROR", err)
            }
            result("reject", new Error(err))
        })
        req.end()
    }

    static open({ self, result }) {
        this.request(self.params, (action, data) => {
           if (action === "reject") {
                self.error = data
            }
            else {
                self.success = true
            }
            result("resolve")

        })
    }

}
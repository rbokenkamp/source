module.exports = class extends PreCore.classes.Branch {

    static respond({self}, request, response) {
        let {url} = request
        console.log("@@@", url)
        if (url === "/") {
            url = "/index.html"
        }
     //   if (url === "/" || url === "/index.html") {
     //       response.writeHead(302, {
      //          location: "/landing",
      //      })
      //      return response.end()
    //    }
        if (url.lastIndexOf(".") === -1) {
            url += "/index.html"
        }

         const {home, mimes} = self.params,
            {existsSync, readFileSync} = PreCore.dependencies.fs,
            full = home + url,
            index = url.lastIndexOf(".")

        if (index === -1 || existsSync(full) === false) {
            response.writeHead(404)
            return response.end()
        }
        const content = readFileSync(full),
            ext = url.substring(index + 1),
            mime = mimes[ext]

        response.writeHead(200, {
            "Content-Type": mime,
        })
        response.end(content)
    }


    static open({self, result}) {
        const {params} = self,
            {readFileSync} = PreCore.dependencies.fs,
            {certHome, port} = params,
            {createServer} = PreCore.dependencies[certHome ? "https": "http"],
            connections = self.connections = {},
            options = {}

        if (certHome) {
            options.key = readFileSync(`${certHome}/key.pem`, "utf8"),
            options.cert = readFileSync(`${certHome}/cert.pem`, "utf8")
        }

        const server = self.server = createServer(options, (request, response) => {
            this.respond({self}, request, response)
        })


       let resolved
        server.listen(port, (err) => {
            if (err) {
                return result("reject", err)
           }

            resolved = true
            console.log(`Http listening on ${port}`)
            result("resolve")
        })
        let index = 0
        server.on("connection", socket => {
            const key = index++
            connections[key] = socket
             socket.on("close", () => {
                delete connections[key]
            })
        })
        server.on("error", err => {
            if (resolved) {
                console.error("ERROR", err)
                return
            }
            result("reject", err)
        })

    }

    static close({self, result}) {
        const {server, connections, params} = self
        for (const key in connections) {
            connections[key].destroy()
        }
        server.close(err => {
            if (err) {
                return result("reject", err)
            }
            console.log(`Http stopped listening on ${params.port}`)
            result("resolve")
        })
    }

}
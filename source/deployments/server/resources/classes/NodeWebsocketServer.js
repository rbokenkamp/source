module.exports = class extends PreCore.classes.Branch {

    static broadcast({self}, data, binary) {
        const {OPEN} = PreCore.dependencies.ws
        self.server.clients.forEach(socket => {
            socket.readyState === WebSocket.OPEN && socket.send(data, {binary})
        })
    }

    static send({self}, socket, data, isBinary) {
        if (!isBinary) {
            data = JSON.stringify(data)
        }
        socket.send(data, {binary})
    }

    static open({self, result}) {
        const {WebSocketServer} = PreCore.dependencies.ws,
            {params} = self,
            options = {}

        if (params.isCombined) {
            const http = self.parent.branches.http
            options.server = http.server
            params.port = http.params.port
        } else {
            options.port = params.port
        }
        const {isCombined, port} = params


        let resolved
        const result2 = err => {
            if (err) {
                return result("reject", err)
            }
            console.log(`Websocket listening on ${port}`)
            resolved = true
            result("resolve")
        }
        const server = self.server = new WebSocketServer(options, result2)

        server.on("connection", socket => {
            console.log("connected")
            socket.on("message", (data, isBinary) => {
                console.log("message", data, isBinary)
            })

        })

        server.on("error", err => {
            if (resolved) {
                return console.error("ERROR", err)
            }
            result("reject", err)
        })
        if (isCombined) {
            result2()
        }
    }

    static close({self, result}) {
        const handler = err => {
            if (err) {
                return result("reject", err)
            }
            console.log(`Websocket stopped listening on ${self.params.port}`)
            result("resolve")
        }
        if (self.params.isCombined) {
            self.server.close()
            return handler()
        }
        const {OPEN} = PreCore.dependencies.ws
        self.server.clients.forEach(socket => {
            console.log("close socket", socket.readyState, OPEN)
            socket.readyState === OPEN && socket.close()
        })
        self.server.close(handler)
    }
}

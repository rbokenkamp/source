module.exports = class extends PreCore.classes.Branch {

    static open({self, result}) {
        const {createServer} = PreCore.dependencies.net
        const {port} = self.params
        const sockets = self.sockets = {}
        let index = 0
        self.connections = 0
        const server = self.server = createServer(socket => {
            const id = index++
            self.connections++
            sockets[id] = sockets
            socket.on("close", () => {
                delete sockets[id]
            })
            socket.on("message", data => {
                console.log("MESSAGE", data)
            })
//            socket.write('Echo server\r\n');
//            socket.pipe(socket);
            console.log("connected")
        })

//        server.listen(1337, '127.0.0.1');

        let resolved
        server.listen(port, (err) => {
            if (err) {
                return result("reject", err)
            }
            console.log("Socket listening on port", port)
            resolved = true
            result("resolve")
        })

        server.on("error", err => {
            if (resolved) {
                return console.error("ERROR", err)
            }
            result("reject", err)
        })
    }

    static input({self}, key, input) {
        const {connections, sockets} = self
        if (connections === 0) {
          return PreCore.exec({}, {self: self.branches[key], handler: "fail", arg: [input]})
        }
        const keys = Object.keys(sockets)
        const id = Math.floor(Math.random()*connections)
        sockets[id].send(JSON.stringify({key, input}))
    }
}
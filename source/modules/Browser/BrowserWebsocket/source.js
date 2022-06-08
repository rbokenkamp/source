module.exports = class extends PreCore.classes.Branch {

    static open({self, result}) {
        const {params} = self
        if (params.url === undefined) {
            params.url = location.href.replace("http", "ws")
        }
        const socket = self.socket = new WebSocket(self.params.url)

        let resolved = false
        socket.onopen = e => {
            console.log("[open] Connection established")
            //       console.log("Sending to server");
            //      socket.send("My name is John");
            resolved = true
            result("resolve")
        }

        socket.onmessage = e => {
            console.log(`[message] Data received from server: ${e.data}`)
        }

        socket.onclose = e => {
            const {wasClean, code, reason} = e
            if (wasClean) {
                console.log(`[close] Connection closed cleanly, code=${code} reason=${reason}`)
            } else {
                // e.g. server process killed or network down
                // event.code is usually 1006 in this case
                console.log('[close] Connection died')
            }
        }

        socket.onerror = err => {
            if (resolved) {
                return console.error("ERROR", err)
            }
            result("reject", err)
        }

    }

    static close({self}) {
        self.socket.close()
    }

}

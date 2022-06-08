module.exports = class extends PreCore.classes.Branch {

    static open({self, result}) {
        const {Socket} = PreCore.dependencies.net
        const {port} = self.params

        const socket = self.socket = new Socket()
        let resolved
        socket.connect(port, err => {
            if (err) {
                return result("reject", err)
            }
            resolved = true
            console.log(`Socket connected to ${port}`)
            result("resolve")
//            client.write('Hello, server! Love, Client.');
        });

        socket.on("error", err => {
            if (resolved) {
                return console.error("ERROR", err)
            }
            result("reject", err)
        })

        socket.on('data', function(data) {
            console.log('Received: ' + data);
          //  client.destroy(); // kill client after server's response
        });

        socket.on('close', function() {
            console.log('Connection closed');
        });
    }
}
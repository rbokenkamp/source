module.exports = {
    type: "NodeDeployment",
    params: {
        home: `${__dirname}/resources`,
        requires: ["NodePreCore"],
        core: {
            type: "Core",
            params: {
                path: "",
                key: "server",
                //          title: "hello",
            }
        }
    }
}
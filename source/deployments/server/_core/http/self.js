module.exports = {
    type: "NodeHttpServer",
    params: {
        port: 2443,
        home: `${PreCore.home}/deployments/server/resources/resources`,
        certHome: `${PreCore.home}/deployments/server/resources/cert`,
        mimes: {
            html: "text/html",
            js: "text/javascript",
            svg: "image/svg+xml",
        }
    }
}

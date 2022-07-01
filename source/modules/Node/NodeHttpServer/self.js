module.exports = {
    type: "Type",
    params: {
        extend: "HttpServer",
        dependencies: {
            fs: "fs",
            http: "http",
            https: "https",
        }
    },
    branches: {
        metas: {
            type: "Branch",
            branches: {
                home: {
                    type: "String",
                    params: {
                        required: true,
                    }
                },
                certHome: {
                    type: "String",
                },
            }
        },
        handlers: {
            type: "Branch",
            branches: {
                open: {
                    type: "Handler",
                    params: {
                        isAsync: true,
                    }
                },
                close: {
                    type: "Handler",
                    params: {
                        isAsync: true,
                    }
                }
            }
        }
    }
}
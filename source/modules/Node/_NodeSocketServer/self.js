module.exports = {
    type: "Type",
    params: {
        extend: "Branch",
        dependencies: {
            net: "net",
            tls: "tls",
        }
    },
    branches: {
        metas: {
            type: "Branch",
            branches: {
                port: {
                    type: "Integer",
                    params: {
                        required: true,
                    }
                }
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
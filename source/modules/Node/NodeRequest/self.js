module.exports = {
    type: "Type",
    params: {
        extend: "Branch",
        dependencies: {
            http: "http",
            https: "https",
        }
    },
    branches: {
        metas: {
            type: "Branch",
            branches: {
                hostname: {
                    type: "String",
                    params: {
                        required: true,
                    }
                },
                port: {
                    type: "Integer",
                    params: {
                        required: true,
                    }
                },
                secure: {
                    type: "Boolean",
                },
                method: {
                    type: "String",
                },
                path: {
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
                }
            }
        }
    }
}
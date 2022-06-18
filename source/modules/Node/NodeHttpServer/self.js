module.exports = {
    type: "Type",
    params: {
        extend: "Branch",
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
                port: {
                    type: "Integer",
                    params: {
                        required: true,
                    }
                },
                home: {
                    type: "String",
                    params: {
                        required: true,
                    }
                },
                certHome: {
                    type: "String",
                },
                mimes: {
                    type: "Param",
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
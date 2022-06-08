module.exports = {
    type: "Type",
    branches: {
        metas: {
            type: "Branch",
            branches: {
                key: {
                    type: "String",
                    params: {
                        required: true,
                    }
                },
                path: {
                    type: "String",
                    params: {
                        required: true,
                    }
                },
                id: {
                    type: "Token",
                    params: {
                        required: true,
                        length: 33,
                    }
                },
                parent: {
                    type: "String",
                    params: {
                        length: 33,
                    }
                },
            }
        },
        handlers: {
            type: "Branch",
            branches: {
                instance: {
                    type: "Handler",
                    params: {
                        isAsync: true,
                    }
                },
                signal: {
                    type: "Handler",
                    params: {
                        isAsync: true,
                    }
                }
            }
        }
    }
}
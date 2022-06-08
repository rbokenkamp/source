module.exports = {
    type: "Type",
    params: {
        extend: "Branch",
        dependencies: {
            ws: "ws",
        }
    },
    branches: {
        metas: {
            type: "Branch",
            branches: {
                port: {
                    type: "Integer",
                },
                isCombined: {
                    type: "Boolean",
                },
            },
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
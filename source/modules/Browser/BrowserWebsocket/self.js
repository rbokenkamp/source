module.exports = {
    type: "Type",
    params: {
        extend: "Branch"
    },
    branches: {
        metas: {
            type: "Branch",
            branches: {
                url: {
                    type: "String",
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
            }
        }
    }
}
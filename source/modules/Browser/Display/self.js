module.exports = {
    type: "Type",
    params: {
        extend: "Branch",
    },
    branches: {
        metas: {
            type: "Branch",
            branches: {
                value: {
                    type: "Param",
                    params: {
                        updatable: true,
                        handler: "setValue",
                    }
                },
                tag: {
                    type: "String",
                },
                nodeSelector: {
                    type: "String",
                }
            }
        }
    }
}
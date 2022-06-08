module.exports = {
    type: "Type",
    params: {
        extend: "Branch",
    },
    branches: {
        metas: {
            type: "Branch",
            branches: {
                required: {
                    type: "Boolean",
                },
                updatable: {
                    type: "Boolean",
                },
                default: {
                    type: "Param",
                },
                handler: {
                    type: "String",
                },
            }
        }
    }
}
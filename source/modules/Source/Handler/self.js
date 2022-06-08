module.exports = {
    type: "Type",
    params: {
        extend: "Branch"
    },
    branches: {
        metas: {
            type: "Branch",
            branches: {
                isAsync: {
                    type: "Boolean",
                },
                isInternal: {
                   type: "Boolean",
                },
                source: {
                    type: "String",
                },
                type: {
                    type: "String"
                }
            }
        }
    }

}
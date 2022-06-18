module.exports = {
    type: "Type",
    params: {
        extend: "Branch"
    },
    branches: {
        metas: {
            type: "Branch",
            branches: {
                extend: {
                    type: "String",
                },
                module: {
                    type: "String",
                    params: {
                        required: true,
                    }
                },
                isPreCore: {
                    type: "Boolean"
                },
                requires: {
                    type: "Array",
                    params: {
                        item: "String",
                    }
                },
                dependencies: {
                    type: "Object",
                },
                template: {
                    type: "String",
                },
                style: {
                    type: "String",
                }
            }
        }
    }
}

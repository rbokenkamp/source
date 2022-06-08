module.exports = {
    type: "Type",
    params: {
        extend: "Core",
        requires: ["Dom"]
    },
    branches: {
        metas: {
            type: "Branch",
            branches: {
                title: {
                    type: "String",
                    params: {
                        required: true,
                        updatable: true,
                        handler: "setTitle",
                    }
                },
                language: {
                    type: "String",
                    params: {
                        length: 2,
                        updatable: true,
                        handler: "setLanguage",
                    }
                }
            }
        }
    }
}
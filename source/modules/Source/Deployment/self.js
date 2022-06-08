module.exports = {
    type: "Type",
    params: {
        extend: "Branch"
    },
    branches: {
        metas: {
            type: "Branch",
            branches: {
                home: {
                   type: "String",
                   params: {
                       required: true,
                   }
                },
                requires: {
                    type: "Array",
                    params: {
                        required: true,
                        item: "String",
                        default: [],
                    }
                },
                core: {
                    type: "Object",
                    params: {
                        required: true,
                    }
                }
            }
        }
    }
}
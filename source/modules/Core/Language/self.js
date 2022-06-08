module.exports = {
    type: "Type",
    params: {
        extend: "Param"
    },
    branches: {
        metas: {
            type: "Branch",
            branches: {
                rtl: {
                    type: "Boolean",
                },
                translations: {
                    type: "Object",
                }
            }
        }
    }

}
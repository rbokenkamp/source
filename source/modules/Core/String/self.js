module.exports = {
    type: "Type",
    params: {
        extend: "Param"
    },
    branches: {
        metas: {
            type: "Branch",
            branches: {
                length: {
                    type: "Integer",
                },
                max: {
                    type: "Integer",
                },
            }
        }
    }
}
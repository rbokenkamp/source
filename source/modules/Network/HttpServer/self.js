module.exports = {
    type: "Type",
    params: {
        extend: "Worker",
    },
    branches: {
        metas: {
            type: "Branch",
            branches: {
                port: {
                    type: "Integer",
                    params: {
                        required: true,
                    }
                },
                mimes: {
                    type: "Param",
                    params: {
                        required: true,
                    }
                }
            }
        },
    }
}
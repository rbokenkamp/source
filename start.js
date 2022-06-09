let [_, __, env] = process.argv
env = env || "development"
const home = __dirname
global.PreCore = require(`${home}/classes/PreCore.js`)
global.PreCore = require(`${home}/classes/NodePreCore.js`)
PreCore.home = home
require(`${home}/types`)
require(`${home}/core`)
require(`${home}/dependencies`)

const { readFileSync } = require("fs")
const products = JSON.parse(readFileSync(`${__dirname}/environments/${env}.json`, "utf8"))
const availability = PreCore.core.branches.availability
for (const productKey in products) {
    const branches = availability.branches[productKey].branches = {}
    const product = products[productKey]
    for (const key in product) {
        const { hostname, port, secure } = product[key]
        branches[key] = {
            type: "NodeRequest",
            params: {
                hostname, port, secure
            }
        }
    }
}


console.log("start")

const result = (action, data) => {
    if (action === "reject") {
        return console.error("REJECT", data)
    }
   console.log("RESOLVE", data)
}

PreCore.start(result)

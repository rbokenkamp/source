const home = __dirname
global.PreCore = require(`${home}/classes/PreCore.js`)
global.PreCore = require(`${home}/classes/NodePreCore.js`)
PreCore.home = home
require(`${home}/types`)
require(`${home}/core`)
require(`${home}/dependencies`)

console.log("start")

const result = (action, data) => {
    if (action === "reject") {
        return console.error("REJECT", data)
    }
    console.log("RESOLVE", data)
}
console.log(PreCore.core)

PreCore.start(result)

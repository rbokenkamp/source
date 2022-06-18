const home = __dirname+"/source"
global.PreCore = require(`${home}/modules/Core/PreCore/source.js`)
global.PreCore = require(`${home}/modules/Library/LibraryPreCore/source.js`)
PreCore.home = home

const result = (action, data) => {
    if (action === "reject") {
        return console.error("REJECT", data)
    }
    console.log("RESOLVE", data)
}

PreCore.start(result)

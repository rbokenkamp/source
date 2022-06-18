module.exports = class extends PreCore {

    static async requireClass(type) {
        PreCore.classes[type] = require(PreCore.home+`/classes/${type}.js`)
    }


}

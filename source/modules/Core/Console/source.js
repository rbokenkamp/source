module.exports = class {

    static log(...arg) {
        console.log(...arg)
    }

    static error(err) {
//        console.error(err)
        throw err
    }
}
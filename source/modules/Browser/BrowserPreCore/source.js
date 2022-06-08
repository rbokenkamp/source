module.exports = class extends PreCore {

    static async requireClass(type) {
        return new Promise((resolve, reject) => {
            const {head} = document
            const script = document.createElement("script")
            script.src = `classes/${type}.js`
            head.appendChild(script)
            script.onload = () => resolve()
            script.onerror = err => reject(err)
        })
    }


}

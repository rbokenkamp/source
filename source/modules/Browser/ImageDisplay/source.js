module.exports = class extends PreCore.classes.Display {

    static create({self}) {
    }
    static open({self}) {
        self.params.tag = "img"
        super.open({self})
        self.node.setAttribute("src", self.params.url)
    }

    static draw({self}) {
        console.log("DRAW")
    }
}

module.exports = class extends PreCore.classes.Core {

    static open({self}) {
        this.setStyles({self})
        this.setTitle({self})
        this.setLanguage({self}, true)
        this.setEventHandler({self})
    }

    static setLanguage({self}, noSignal) {
        const {language} = self.params
        const {rtl} = self.branches.languages.branches[language].params
        document.body.classList[rtl ? "add" : "remove"]("Rtl")
        if (!noSignal) {
            PreCore.exec({}, {self, handler: "signal", arg: ["setLanguage", [language], {childrenOnly: true}]})
        }
    }

    static setStyles({self}) {
        const {types} = PreCore,
            {head} = document
        for (const key in types) {
            const {style} = types[key].params
            if (style) {
                const node = document.createElement("style")
                node.setAttribute("id", `style-${key}`)
                node.innerHTML = style
                head.appendChild(node)
            }
        }
    }

    static setTitle({self}) {
        const {title} = self.params
        let node = document.querySelector("title")
        if (!node) {
            node = document.createElement("title")
            document.head.appendChild(node)
        }
        node.innerHTML = title
    }

    static setEventHandler({self}) {
        document.onclick = document.ontouchstart = ({target}) => {
            const {Dom} = PreCore.classes
            //      const node = Dom.findNode(target, node => node._branch !== undefined)
            const node = Dom.findNode(target, node => node.getAttribute("data-event"))
            if (!node) {
                return
            }
            const data = Dom.getAttributes(node, "data-")
            const parent = Dom.findNode(target, node => node._branch !== undefined)
            if (!parent) {
                return
            }
            PreCore.exec({}, {self: parent._branch, handler: "trigger", arg: [data]})
        }
    }
}

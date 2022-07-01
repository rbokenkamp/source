module.exports = class extends PreCore.classes.Display {


    static open({self}) {
        super.open({self})
        this.setDisplayMode({self})
    }

    static setDisplayMode({self}) {
        const {language} = PreCore.core.params,
            {node} = self
        node.setAttribute("mode", "display")
        node.innerHTML = ""
        const img = document.createElement("img")
        img.setAttribute("src", `/img/flags/${language}.svg`)
        img.setAttribute("data-event", "edit")
        node.appendChild(img)
    }

    static setEditMode({self}) {
        const {node} = self
        node.setAttribute("mode", "edit")
        node.innerHTML = ""
        this.setLanguages({self})
        this.setLanguage({self})
    }

    static setLanguages({self}) {
        const {node} = self
        const languages = PreCore.core.branches.languages.branches
        for (const key in languages) {
            const img = document.createElement("img")
            img.setAttribute("src", `/img/flags/${key}.svg`)
            img.setAttribute("data-event", "select")
            img.setAttribute("data-key", key)
            node.appendChild(img)
        }
    }

    static setLanguage({self}) {
        const {language} = PreCore.core.params
        for (const child of self.node.children) {
            child.classList[child.getAttribute("data-key") === language ? "add" : "remove"]("Selected")
        }
    }

    static select({self}, {key}) {
        PreCore.exec({}, {self: PreCore.core, handler: "set", arg: [".language", key]})
        this.setDisplayMode({self})
    }

    static edit({self}) {
        this.setEditMode({self})
    }
}
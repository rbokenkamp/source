PreCore.classes.LanguageSelector = class extends PreCore.classes.Display {


    static open({self}) {
        super.open({self})
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
            child.classList[child.getAttribute("data-key") === language ? "add": "remove"]("Selected")
        }
    }

    static select({self}, {key}) {
        PreCore.exec({}, {self: PreCore.core, handler: "set", arg: [".language", key]})
     }
}
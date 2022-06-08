module.exports = class extends PreCore.classes.Display {


    static setValue({self}) {
        const {value} = self.params
        if (value !== undefined) {
            this.setLanguage({self})
        }
    }

    static setLanguage({self}) {
        const {core} = PreCore
        const {language} = PreCore.core.params
        const languages = core.branches.languages.branches
        self.node.innerHTML = languages[language].params.translations[self.params.value]
    }
}
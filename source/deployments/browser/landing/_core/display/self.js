module.exports = {
    type: "Layout",
    branches: {
        selector: {
            type: "LanguageSelector",
            params: {
                nodeSelector: "#languageSelector"
            }
        },
        message: {
            type: "LanguageDisplay",
            params: {
//                url: "img/tulips.png",
                value: "hello",
                nodeSelector: "#displayMessage"
            }
        }
    }
}
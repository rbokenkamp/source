module.exports = class {

    static arrayToHash(value) {
        const result = {}
        for (const char of value) {
            result[char] = true
        }
        return result
    }

    static boot() {
        this.space = this.arrayToHash(" \t\n\r")
        const digit = this.digit = this.arrayToHash("0123456789")
        const alpha = this.alpha = this.arrayToHash("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
        this.word = Object.assign({}, digit, alpha)
    }

    static parseValue({self}) {
        const {chars} = self
        let char
        while (this.space[char = chars[self.i]]) {
            self.i++
        }
        if (char !== '"') {
            this.syntaxError({self})
        }
        self.i++
        let value = ""
        let escape
        while (self.i < chars.length) {
            const char = chars[self.i]
            if (escape) {
                escape = false
            } else if (char === "\\") {
                escape = true
            } else if (char === '"') {
                self.i++
                return value
            }
            value += char
            self.i++
        }
        this.syntaxError({self})
    }

    static parseAttribute({self}) {
        const {chars, current} = self
        let key = chars[self.i]
        self.i++
        let char
        while (this.word[char = chars[self.i]]) {
            key += char
            self.i++
        }
        if (this.space[char]) {
            self.i++
            while (this.space[char = chars[self.i]]) {
                self.i++
            }
        }
        if (char === "=") {
            self.i++
            const attributes = current.attributes = current.attributes || {}
            attributes[key] = this.parseValue({self})
            return
        }
        this.syntaxError({self})

    }

    static parseAttributes({self}) {
        const {chars} = self
        let char
        while (self.i < chars.length) {
            while (this.space[char = chars[self.i]]) {
                self.i++
            }
            if (char === ">") {
                self.i++
                return
            }
            if (this.alpha[char]) {
                this.parseAttribute({self})
                continue
            }
            if (char === "/" && chars[self.i + 1] === ">") {
                this.closeTag({self})
                self.i += 2
                return
            }
            this.syntaxError({self})
        }
        this.syntaxError({self})
    }

    static closeTag({self}) {
        if (self.current.parent) {
            const current = self.current
            self.current = current.parent
            delete current.parent
        } else {
            self.current = undefined
        }
    }

    static parseTag({self}) {
        const {chars} = self
        while (this.space[chars[self.i]]) {
            self.i++
        }
        const char = chars[self.i]
        if (char === "/") {
            const tag = self.current.tag
            self.i++
            for (let i = 0; i < tag.length; i++) {
                if (chars[self.i] !== tag[i]) {
                    this.syntaxError({self})
                }
                self.i++
            }
            if (chars[self.i] !== ">") {
                this.syntaxError({self})
            }
            this.closeTag({self})
            self.i++
            return
        }
        if (!this.alpha[char]) {
            this.syntaxError({self})
        }
        let {current} = self
        if (current === undefined) {
            current = self.base = self.current = {}
        } else {
            const elements = current.elements = current.elements || []
            current = self.current = {
                parent: current
            }
            elements.push(current)
        }
        current.tag = ""
        current.value = ""
        while (true) {
            const char = chars[self.i]
            if (this.word[char]) {
                current.tag += char
                self.i++
                continue
            }
            break
        }

        this.parseAttributes({self})

    }

    static parseComment({self}) {
        const {chars} = self
        self.stage = "comment"
        escape = false
        while (self.i < chars.length) {
            const char = chars[self.i]
            if (escape) {
                escape = false
                self.i++
                continue
            }
            if (char === "\\") {
                escape = true
                self.i++
                continue
            }
            if (char === "-" && chars[self.i + 1] === "-" && chars[self.i + 2] === ">") {
                self.i += 3
                self.stage = "body"
                return
            }
            self.i++
        }
    }

    static syntaxError({self}) {
        const {i, chars} = self
        if (i < chars.length) {
            throw new Error(`Invalid character ${chars[i]} at position ${i}`)
        }
        throw new Error(`Unexpected end at position ${i}`)
    }

    static parseBody({self}) {
        let value = ""
        const {chars} = self
        while (self.i < chars.length) {
            const char = chars[self.i]
            if (this.space[char]) {
                self.i++
                continue
            }
            if (char === "<") {
                if (chars[self.i + 1] === "!" && chars[self.i + 2] === "-" && chars[self.i + 3] === "-") {
                    self.i = self.i + 4
                    this.parseComment({self})
                    continue
                }
                self.i++
                this.parseTag({self})
                continue
            }
            if (!self.current) {
                this.syntaxError({self})
            }
            if (self.current === undefined) {
                this.syntaxError({self})
            }
            self.current.value += char
            self.i++
        }


    }

    static translate(xml) {
        const self = {
            chars: [...xml],
            i: 0,
            stage: "body",
        }
        this.parseBody({self})
        if (self.stage !== "body") {
            this.syntaxError({self})
        }
        return self.base
    }
}

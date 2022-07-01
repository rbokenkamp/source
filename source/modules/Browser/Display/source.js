
module.exports = class extends PreCore.classes.Branch {

    static open({self}) {
        const {type, parent, params} = self
        const parentNode = parent.node || document.body
        const {nodeSelector, tag} = params
        if (self.node) {

        }
        else if (nodeSelector) {
            self.node = parentNode.querySelector(nodeSelector)
        } else {
            self.node = document.createElement(tag || "div")
            parentNode.appendChild(self.node)
        }
        const {node} = self
        node._branch = self
   //     node.setAttribute("id", "_"+params.id)
        this.setType({self}, type)

        this.setTemplate({self})
        this.setValue({self})
    }

    static setType({self}, type) {
        const {types} = PreCore

        if (!PreCore.instanceOf(type, "Display")) {
            return
        }
        this.setType({self}, PreCore.types[type].params.extend)
        self.node.classList.add(type)
    }
    static setTemplate({self}) {
        const {template} = PreCore.types[self.type].params
        if (template) {
            self.node.innerHTML = template
        }
    }

    static setValue({self}) {
        const {value} = self.params
        if (value !== undefined) {
            self.node.innerHTML = value
        }
    }

    static trigger({self}, data) {
        const {event} = data
        let current = self
        while (current) {
            const cls = PreCore.classes[current.type]
            if (event in cls) {
                return cls[event]({self: current}, data)
            }
            current = current.parent
        }

    }
}
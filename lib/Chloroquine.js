/**
 * Class that represents the terms replacer
 */
class Chloroquine {
    // Constants
    static STORAGE_LABEL = 'Chloroquine'
    static TAGS_TO_SCAN = '*'

    // Map of terms to replace
    mappings = {}

    // HTML document & elemens to replace terms
    elements = []

    /**
     * Class constructor
     * @param {HTMLDocument} document: The page to find terms to replace
     * @param {Object} mappings: Term mappings object
     */
    constructor(document, mappings) {
        // If document passed, set elements
        if (document && (Object.keys(document).length > 0)) {
            this.elements = Array.from(
                document.getElementsByTagName(Chloroquine.TAGS_TO_SCAN)
            )
        }

        // If term mappings passed, set it and run replacements
        if (mappings && (Object.keys(mappings).length > 0)) {
            // Set term mappings
            this.setMappings(mappings)

            // Run replacement
            this.runReplacements()
        }
    }

    /**
     * Run terms replacements
     */
    runReplacements() {
        // For all mappings
        Object.keys(this.mappings).forEach((key) => {
            // Replace in elements
            if (this.elements.length > 0) {
                this.replace(this.elements, key, this.mappings[key])
            }
        })
    }

    /**
     * Function responsible to replace the terms
     * @param {Array} elements: Array of HTML elements
     * @param {String} from: Term to search for
     * @param {String} to: Replacement term
     */
    replace(elements, from, to) {
        // For all elements
        elements.forEach((element) => {
            // Into all its child nodes
            element.childNodes.forEach((node) => {
                // For node type(s)
                switch (node.nodeType) {
                    // Type 3 (Text node)
                    case 3: {
                        // Replace nodeValue
                        element.replaceChild(
                            document.createTextNode(
                                node.nodeValue.replace(from, to)
                            ),
                            node
                        )
                    }
                }
            })
        })
    }

    /**
     * Add term to mappings
     * @param {String} from: Term to add to mappings
     * @param {String} to: Replacement term to add to mappings
     */
    addMap(from, to) {
        this.mappings[from] = to
    }

    /**
     * Remove term from mappings
     * @param {String} from: Term to search for removal
     */
    removeMap(from) {
        delete this.mappings[from]
    }

    /**
     * Set term mappings using mappings param
     * @param {Object} mappings: Term mappings object
     */
    setMappings(mappings) {
        this.mappings = mappings
    }

    /**
     * Return term mappings
     */
    getMappings() {
        return this.mappings
    }
}
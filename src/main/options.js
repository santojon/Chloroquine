// ------------------------------
// CONSTANTS AREA
// ------------------------------

// Chloroquine storage label
storageLabel = Chloroquine.STORAGE_LABEL

// Chloroquine instance
chloroquine = new Chloroquine(document)


// ------------------------------
// SAVE OPTIONS AREA
// ------------------------------

/**
 * Saves Chloroquine options (used only in options page)
 * @param {String} term: Term to add
 * @param {String} replacement: Replacement to add
 */
saveOptions = (term, replacement) => {
    // Add new map to chloroquine
    chloroquine.addMap(term, replacement)

    // Get data from instance
    data = chloroquine.getMappings()

    // Save to local storage
    chrome.storage.local.set(
        { [storageLabel]: data },
        () => {
            // Save to sync storage
            chrome.storage.sync.set(
                { [storageLabel]: data },
                () => {
                    // After save restore to page
                    buildUI({ [storageLabel]: data }, true)
                }
            )
        }
    )
}


// ------------------------------
// DELETE OPTIONS AREA
// ------------------------------

/**
 * Removes option for passed term (used only in options page)
 * @param {String} term: Term to remove from mappings
 */
deleteOption = (term) => {
    // Remove mapping from chloroquine
    chloroquine.removeMap(term)

    // Get data from instance
    data = chloroquine.getMappings()

    // Save to local storage
    chrome.storage.local.set(
        { [storageLabel]: data },
        () => {
            // Save to sync storage
            chrome.storage.sync.set(
                { [storageLabel]: data },
                () => {
                    // Update the UI
                    buildUI({ [storageLabel]: data }, true)
                }
            )
        }
    )
}


// ------------------------------
// RESTORE OPTIONS AREA
// ------------------------------

/**
 * Restores Chloroquine options
 * @param {Boolean} reflectOnUI: Flag to set data reflection on UI (if used in options page)
 */
restoreOptions = (reflectOnUI) => {
    chrome.storage.local.get([storageLabel], (localMappings) => {
        // Have saved data locally
        if (localMappings && (Object.keys(localMappings).length > 0)) {
            // Create and run term replacer using document and mappings
            chloroquine = new Chloroquine(document, localMappings[storageLabel])

            // Set user mappings to sync storage
            chrome.storage.sync.set({ [storageLabel]: localMappings[storageLabel] })

            // Reflect data to UI
            if (reflectOnUI) {
                buildUI(localMappings)
            }
        } else {
            // No data saved locally, find on sync data
            chrome.storage.sync.get([storageLabel], (syncMappings) => {
                // Have saved data on sync
                if (syncMappings && (Object.keys(syncMappings).length > 0)) {
                    // Create and run term replacer using document and mappings
                    chloroquine = new Chloroquine(document, syncMappings[storageLabel])

                    // Save term mappings locally
                    chrome.storage.local.set({ [storageLabel]: syncMappings[storageLabel] })

                    // Reflect data to UI
                    if (reflectOnUI) {
                        buildUI(syncMappings)
                    }
                }
            })
        }
    })
}


// ------------------------------
// OPTIONS UI AREA
// ------------------------------

/**
 * Update UI to reflect data (used only in options page)
 * @param {Object} mappings: Options mp to reflect on UI
 * @param {Boolean} fromScratch: Set to re-build using given data
 *                               removing existent rows from the UI
 */
buildUI = (mappings, fromScratch) => {
    // Input row
    addTermRow = document.getElementById('add-term-row')

    // Clear all existing row in the UI if requested
    if (fromScratch) {
        while ((addTermRow.nextSibling !== null) && (addTermRow.nextSibling !== undefined)) {
            addTermRow.parentNode.removeChild(addTermRow.nextSibling)
        }
    }

    // For all mappings, add rows
    Object.keys(mappings[storageLabel]).forEach((key) => {
        newRow = document.createElement('tr')
        newRow.innerHTML = '<td colspan ="5">' + key + '</td >' +
            '<td colspan="6">' + mappings[storageLabel][key] + '</td>' +
            '<td colspan="1">' +
            '<buttom id="btn_' + key + '" class="btn btn-outline-dark px-4 float-md-right" title="Remove">' +
            '<svg class="bi bi-x" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
            '<path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z" clip-rule="evenodd" />' +
            '<path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z" clip-rule="evenodd" />' +
            '</svg >' +
            '</buttom>' +
            '</td>'

        // Insert new row after add term row
        addTermRow.parentNode.insertBefore(newRow, addTermRow.nextSibling)

        // Set remove buttom function
        document.getElementById('btn_' + key).addEventListener('click', () => {
            deleteOption(key)
        })
    })
}
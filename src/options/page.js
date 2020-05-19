// Restore Chloroquine data and run terms replacer
restoreOptions(true)

// Add buttom function
document.getElementById('add-btn').addEventListener('click', () => {
    // Get inputs
    term = document.getElementById('add-term')
    replacement = document.getElementById('add-replacement')

    // Save its values
    saveOptions(term.value, replacement.value)

    // Clear inputs
    term.value = ''
    replacement.value = ''
})
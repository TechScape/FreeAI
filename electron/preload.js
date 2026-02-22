// preload.js — runs in isolated renderer context
// Currently no IPC bridges needed; kept for future extensibility.
window.addEventListener('DOMContentLoaded', () => {
    // Set the page title in case the HTML title tag is overridden
    document.title = 'Sajid AI';
});

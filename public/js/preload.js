const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('minimize').addEventListener('click', () => {
        ipcRenderer.send('minimize-app');
    });

    document.getElementById('close').addEventListener('click', () => {
        ipcRenderer.send('close-app');
    });
})
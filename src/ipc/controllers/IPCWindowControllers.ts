import {app, BrowserWindow, IpcMain } from "electron";

export default function registerWindowControllers(ipcMain: IpcMain) {
    ipcMain.on('minimize-app', () => {
        BrowserWindow.getFocusedWindow().minimize();
    });
    
    ipcMain.on('close-app', () => {
        app.quit();
    });
}
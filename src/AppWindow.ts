import { BrowserWindow, App } from 'electron';
import path = require('path');
import IPCMainLoader from './ipc/IPCMainLoader';

export default class AppWindow {
    private static mainWindow: BrowserWindow | null = null;
    private static application: App;

    private static onWindowAllClosed = () => {
        if (process.platform !== 'darwin') {
            AppWindow.application.quit();
        }
    };

    private static onClose = () => {
        AppWindow.mainWindow = null;
    };

    private static onReady = () => {
        AppWindow.mainWindow = new BrowserWindow({
            width: 1080,
            height: 720,
            frame: false,
            resizable: false,
            movable: true,
            hasShadow: true,
            title: "SimpleGraph",
            webPreferences: {
                devTools: true,
                nodeIntegration: true,
                preload: path.join(__dirname, "..", "public", "js", "preload.js")
            }
        });
        AppWindow.mainWindow.loadFile(path.join(__dirname, "..", "public", "index.html"))
        AppWindow.mainWindow.on('closed', AppWindow.onClose);
        IPCMainLoader.loadHandlers();
    };

    static main(app: App) {
        AppWindow.application = app;
        app.on('window-all-closed', AppWindow.onWindowAllClosed);
        app.once('ready', AppWindow.onReady);
    }
}

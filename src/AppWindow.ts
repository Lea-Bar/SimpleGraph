import { BrowserWindow, App } from 'electron';
import path = require('path');

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
            frame: false
        });
        AppWindow.mainWindow.loadFile(path.join(__dirname, "..", "public", "index.html"))
        AppWindow.mainWindow.on('closed', AppWindow.onClose);
    };

    static main(app: App) {
        AppWindow.application = app;
        app.on('window-all-closed', AppWindow.onWindowAllClosed);
        app.once('ready', AppWindow.onReady);
    }
}

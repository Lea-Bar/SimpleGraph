import { ipcMain } from "electron";
import registerWindowControllers from "./controllers/IPCWindowControllers";

export default class IPCMainLoader {
    static loadHandlers() {
        registerWindowControllers(ipcMain);
    }
}
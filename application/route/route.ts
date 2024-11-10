import { IpcMain } from "electron";
import listLogsRouter from "./list.logs.route";
import checkInternetRoute from "./check.internet.route";
import scrapDropperRouter from "./scrap.dropper.route";
import listSneakersRouter from "./list.sneakers.route";

export default (ipcHandler: IpcMain) => {
    listLogsRouter(ipcHandler)
    checkInternetRoute(ipcHandler)
    scrapDropperRouter(ipcHandler)
    listSneakersRouter(ipcHandler)
}
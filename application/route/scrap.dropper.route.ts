import { IpcMain } from "electron";
import WorkerHandler from "../handler/worker.handler";
import ScrapDroperUsecaseWorker from "../usecase/scrap/scrap.droper.uscase.worker";
import { mainWindow } from "../main";

const scrapDropperRouter  = (ipcHandler: IpcMain) => {
    ipcHandler.handle('scrap-droper', async (_, args) => {
        try {
          console.log('Starting scrap-droper...');
          const thread = new ScrapDroperUsecaseWorker();
          const worker = new WorkerHandler(thread, args);
      
          thread.startListners([
            {
              refKey: 'updateStatus',
              callback: async (search) => {
                mainWindow?.webContents.send('scrap-status-update', search);
              },
            }
          ]);
      
          worker.startWorkerAction();
        } catch (error) {
          console.error('Error handling scrap-droper:', error);
          throw error;
        }
      });
}

export default scrapDropperRouter
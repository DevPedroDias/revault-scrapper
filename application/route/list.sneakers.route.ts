import { IpcMain } from "electron";
import ListSneakersUseCaseFactory from "../usecase/list-sneakers/list.sneakers.usecase.factory";

const listSneakersRouter  = (ipcHandler: IpcMain) => {
    ipcHandler.handle('list-sneakers', async (_, args) => {
        try {
          const usecase = ListSneakersUseCaseFactory.build();
          const logs = await usecase.execute(args);
          return logs;
        } catch (error) {
          console.error('Error handling list-sneakers:', error);
          throw error;
        }
      });
}

export default listSneakersRouter
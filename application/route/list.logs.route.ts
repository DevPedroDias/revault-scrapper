import { IpcMain } from "electron";
import ListLogsUseCaseFactory from "../usecase/list-logs/list.logs.usecase.factory";

const listLogsRouter  = (ipcHandler: IpcMain) => {
    ipcHandler.handle('list-logs', async () => {
        try {
          const usecase = ListLogsUseCaseFactory.build();
          const logs = await usecase.execute();
          return logs;
        } catch (error) {
          console.error('Error handling list-logs:', error);
          throw error;
        }
      });
}

export default listLogsRouter
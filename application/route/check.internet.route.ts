import { IpcMain } from "electron";
import dns from 'dns';

const checkInternetRoute  = (ipcHandler: IpcMain) => {
    ipcHandler.handle('check-internet', async () => {
        return new Promise((resolve) => {
          dns.lookup('google.com', (err) => {
            if (err) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });
      });
}

export default checkInternetRoute
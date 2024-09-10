import { contextBridge, ipcRenderer } from 'electron'
import { preloads } from './preloads/preloads'
import { ScrapStatusProcess } from './domain/value-objects/scrap.status.process';

contextBridge.exposeInMainWorld('ipcRenderer', preloads)
contextBridge.exposeInMainWorld('electronAPI', {
    scrapDroper: (args: unknown) => ipcRenderer.invoke('scrap-droper', args),
    listLogs: () => ipcRenderer.invoke('list-logs'),
      // Expor os eventos de status
    onStatusUpdate: (callback: (status: ScrapStatusProcess) => void) => {
      ipcRenderer.on('scrap-status-update', (_, status) => callback(status));
    },

    // Limpar os listeners quando não forem mais necessários
    removeStatusListener: () => {
      ipcRenderer.removeAllListeners('scrap-status-update');
    }
  });
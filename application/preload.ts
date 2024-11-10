import { contextBridge, ipcRenderer } from 'electron'
import { preloads } from './preloads/preloads'
import Search from './domain/entity/search';

contextBridge.exposeInMainWorld('ipcRenderer', preloads)
contextBridge.exposeInMainWorld('electronAPI', {
    scrapDroper: (args: unknown) => ipcRenderer.invoke('scrap-droper', args),
    listSneakers: (args: unknown) => ipcRenderer.invoke('list-sneakers', args),
    listLogs: () => ipcRenderer.invoke('list-logs'),
    checkInternet: () => ipcRenderer.invoke('check-internet'),
    onStatusUpdate: (callback: (search: Search) => void) => {
      ipcRenderer.on('scrap-status-update', (_, status) => callback(status));
    },

    // Limpar os listeners quando não forem mais necessários
    removeStatusListener: () => {
      ipcRenderer.removeAllListeners('scrap-status-update');
    }
  });
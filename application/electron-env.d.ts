/// <reference types="vite-plugin-electron/electron-env" />

import type { Search } from './models/Search'; // Importa a classe Search como tipo

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_ROOT: string;
      VITE_PUBLIC: string;
    }
  }

  interface Window {
    ipcRenderer: import('electron').IpcRenderer;
    electronAPI: {
      scrapDroper: (args: Record<string, unknown>) => Promise<unknown>;
      listSneakers: (args: unknown) => Promise<unknown>;
      listLogs: () => Promise<unknown[]>;
      checkInternet: () => Promise<boolean>;
      onStatusUpdate: (callback: (search: Search) => void) => void;
      removeStatusListener: () => void;
    };
  }
}

export {}; // Isso é necessário para que o arquivo seja tratado como um módulo

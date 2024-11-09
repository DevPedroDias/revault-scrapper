import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import WorkerHandler from './handler/worker.handler';
import ScrapDroperUsecaseWorker from './usecase/scrap/scrap.droper.uscase.worker';
import { initializeDb } from './libs/sqlite/database';
import PostProcessScrapUseCaseFactory from './usecase/post-process-scrap/post.process.scrap.usecase.factory';
import { MakeRegisterLogInput } from './usecase/usecase.by.event';
import { StatusScrap } from './domain/value-objects/status.scrap';
import ListLogsUseCaseFactory from './usecase/list-logs/list.logs.usecase.factory';
import dns from 'dns';
import ValidateFileStructureUsecase from './usecase/validate-file-strutcture/validate.file.structure.usecase';
import SyncFilesUsecase from './usecase/sync-files/sync.files.usecase';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let mainWindow: BrowserWindow | null;
let splashWindow: BrowserWindow | null;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  splashWindow.loadFile(path.join(__dirname, '../src/assets/loader/splash.html'));
}

function createMainWindow() {
  const isDev = process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER_URL;

  const iconPath = isDev
    ? path.join(__dirname, '../src/assets/favicon.svg') // Modo de desenvolvimento
    : path.join(process.env.VITE_PUBLIC, 'favicon.svg');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: iconPath,
    show: false, // Inicialmente oculto
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Main window finished loading.');
    mainWindow?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  mainWindow.once('ready-to-show', () => {
    console.log('Main window is ready to show.');
    mainWindow?.setMenu(null);
    mainWindow?.webContents.openDevTools();
    mainWindow?.show(); // Mostrar a janela principal somente após o splash ser fechado
    splashWindow?.close(); // Fecha a janela de splash
  });

  // Carregar a URL ou o arquivo local dependendo do ambiente
  if (VITE_DEV_SERVER_URL) {
    console.log('Loading VITE_DEV_SERVER_URL:', VITE_DEV_SERVER_URL);
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    const indexPath = path.join(RENDERER_DIST, 'index.html');
    console.log('Loading local file:', indexPath);
    mainWindow.loadFile(indexPath).catch((error) => {
      console.error('Error loading index.html:', error);
    });
  }
}

app.whenReady().then(async () => {
  try {
    createSplashWindow();
    await initializeDb();
    createMainWindow();

    app.on('window-all-closed', () => {
      console.log('All windows closed.');
      if (process.platform !== 'darwin') {
        app.quit();
        mainWindow = null;
      }
    });

    app.on('activate', () => {
      console.log('App activated.');
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
});

// Handlers IPC
ipcMain.handle('list-logs', async () => {
  try {
    const usecase = ListLogsUseCaseFactory.build();
    const logs = await usecase.execute();
    console.log('Logs retrieved successfully.');
    return logs;
  } catch (error) {
    console.error('Error handling list-logs:', error);
    throw error;
  }
});

ipcMain.handle('scan-file-structure', async () => {
  try {
    const usecase = new ValidateFileStructureUsecase();
    await usecase.execute();
    return true
  } catch (error) {
    console.error('Error handling scan-file-structure:', error);
    throw error;
  }
});

ipcMain.handle('sync-files', async () => {
  try {
    const usecase = new SyncFilesUsecase();
    await usecase.execute();
    return true
  } catch (error) {
    console.error('Error handling sync-files:', error);
    throw error;
  }
});

ipcMain.handle('check-internet', async () => {
  return new Promise((resolve) => {
    dns.lookup('google.com', (err) => {
      if (err) {
        resolve(false); // Sem conexão
      } else {
        resolve(true); // Conectado à internet
      }
    });
  });
});

ipcMain.handle('scrap-droper', async (_, args) => {
  try {
    console.log('Starting scrap-droper...');
    const thread = new ScrapDroperUsecaseWorker();
    const worker = new WorkerHandler(thread, args);

    thread.startListners([
      {
        refKey: 'updateStatus',
        callback: async (status) => {
          console.log('Updating scrap status:', status);
          mainWindow?.webContents.send('scrap-status-update', status);
        },
      },
      {
        refKey: 'post-processing-logger',
        callback: async (postProcessingData) => {
          try {
            const castedInput = postProcessingData as MakeRegisterLogInput;
            thread.interceptEvent().emit('updateStatus', {
              type: StatusScrap.startingDataCompilation,
              logId: castedInput.status.logId,
            });

            const usecase = PostProcessScrapUseCaseFactory.build();
            const inputData = {
              newStatus: castedInput.status,
              inputArgs: { input: castedInput.registerData.input, filename: castedInput.registerData.filename } as { input: Record<string, unknown>, filename: string },
              sneakers: castedInput.registerData.sneakers as Record<string, unknown>[],
            };

            await usecase.execute(inputData);

            thread.interceptEvent().emit('updateStatus', {
              type: StatusScrap.finishedDataCompilation,
              logId: castedInput.status.logId,
            });
          } catch (error) {
            console.error('Error during post-processing:', error);
            thread.interceptEvent().emit('updateStatus', {
              type: StatusScrap.error,
              message: (error as Error).message,
            });
          }
        },
      },
    ]);

    worker.startWorkerAction();
  } catch (error) {
    console.error('Error handling scrap-droper:', error);
    throw error;
  }
});

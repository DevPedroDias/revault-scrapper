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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  try {
    console.log("Creating browser window...");

    win = new BrowserWindow({
      width: 1280,
      height: 720,
      icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),  // Verifique se este caminho está correto após o build
        nodeIntegration: true,
        nodeIntegrationInWorker: true
      },
    });

    win.webContents.on('did-finish-load', () => {
      console.log('Window finished loading.');
      win?.webContents.send('main-process-message', new Date().toLocaleString());
    });

    // Abre a janela quando ela estiver pronta e ativa o DevTools
    win.once('ready-to-show', () => {
      console.log('Window is ready to show.');
      win?.show();
      win?.webContents.openDevTools();  // Ativa DevTools para depuração
    });

    // Carrega a URL ou o arquivo local dependendo do ambiente
    if (VITE_DEV_SERVER_URL) {
      console.log('Loading VITE_DEV_SERVER_URL:', VITE_DEV_SERVER_URL);
      win.loadURL(VITE_DEV_SERVER_URL);
    } else {
      const indexPath = path.join(RENDERER_DIST, 'index.html');
      console.log('Loading local file:', indexPath);
      win.loadFile(indexPath).catch((error) => {
        console.error('Error loading index.html:', error);
      });
    }
  } catch (error) {
    console.error('Error creating window:', error);
  }
}

app.whenReady().then(async () => {
  try {
    console.log('Initializing database...');
    await initializeDb();
    console.log('Database initialized successfully.');

    createWindow();  // Cria a janela ao inicializar o aplicativo

    app.on('window-all-closed', () => {
      console.log('All windows closed.');
      if (process.platform !== 'darwin') {
        app.quit();
        win = null;
      }
    });

    app.on('activate', () => {
      console.log('App activated.');
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
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
          win?.webContents.send('scrap-status-update', status);
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

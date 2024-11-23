import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import SetIPCRoutes from './route/route'
import AppDataSource from './libs/typeorm/database';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

export let mainWindow: BrowserWindow | null;
let splashWindow: BrowserWindow | null;

function createSplashWindow() {
  const isDev = process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER_URL;
  const splashPath = isDev
    ? path.join(__dirname, '../src/assets/loader/splash.html') // Desenvolvimento
    : path.join(RENDERER_DIST, 'assets/loader/splash.html'); // Produção

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

  console.log('Loading splash file:', splashPath); // Log para depuração
  splashWindow.loadFile(splashPath).catch((err) => {
    console.error('Error loading splash.html:', err);
  });
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
    if (isDev) mainWindow?.webContents.openDevTools();
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
    await AppDataSource.initialize();
    createMainWindow();

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
        mainWindow = null;
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
});

SetIPCRoutes(ipcMain)

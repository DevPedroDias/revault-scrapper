import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import WorkerHandler from './handler/worker.handler'
import ScrapDroperUsecaseWorker from './usecase/scrap/scrap.droper.uscase.worker'
import { initializeDb } from './libs/sqlite/database'
import PostProcessScrapUseCaseFactory from './usecase/post-process-scrap/post.process.scrap.usecase.factory'
import { MakeRegisterLogInput } from './usecase/usecase.by.event'
import { StatusScrap } from './domain/value-objects/status.scrap'
import ListLogsUseCaseFactory from './usecase/list-logs/list.logs.usecase.factory'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720, 
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    },
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

app.whenReady().then(async () => {
  await initializeDb()
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
      win = null
    }
  })
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  ipcMain.handle('list-logs', async () => {
    const usecase = ListLogsUseCaseFactory.build()
    return await usecase.execute()
  })

  ipcMain.handle('scrap-droper', async (_, args) => {
    const thread = new ScrapDroperUsecaseWorker()
    const worker = new WorkerHandler(thread, args)
    thread.startListners([
      {
        refKey: 'updateStatus',
        callback: async (status) => {
            win?.webContents.send('scrap-status-update', status);
        }
      },
      {
        refKey: 'post-processing-logger',
        callback: async (postPrecessingData) => {
          try {
            const castedInput = postPrecessingData as MakeRegisterLogInput
            thread.interceptEvent().emit('updateStatus', { 
              type: StatusScrap.startingDataCompilation,
              logId: castedInput.status.logId
          })
            const usecase = PostProcessScrapUseCaseFactory.build()
            const inputData = {
              newStatus: castedInput.status, 
              inputArgs:{input: castedInput.registerData.input, filename: castedInput.registerData.filename} as {input: Record<string, unknown>, filename: string},
              sneakers: castedInput.registerData.sneakers as Record<string, unknown>[],
          }
            await usecase.execute(inputData)

            thread.interceptEvent().emit('updateStatus', { 
              type: StatusScrap.finishedDataCompilation,
              logId: castedInput.status.logId
          })
          } catch (error) {
            const castedError = error as Error
            thread.interceptEvent().emit('updateStatus', { 
              type: StatusScrap.error,
              message: castedError.message
          })
          }
        }
      }
    ])
    
    worker.startWorkerAction()
  });

  createWindow()
})

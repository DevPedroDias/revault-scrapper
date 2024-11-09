import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export default abstract class FileHandler {
    protected readonly _basePath: string
    protected readonly _unsyncFilesFolderPath: string
    constructor() {
        this._basePath = path.join(app.getPath('desktop'), 'revault')
        this._unsyncFilesFolderPath = path.join(this._basePath, 'unsync')
        if (!fs.existsSync(this._basePath)) {
            fs.mkdirSync(this._basePath);
        }
        !fs.existsSync(this._unsyncFilesFolderPath) && fs.mkdirSync(this._unsyncFilesFolderPath)
    }

    protected writeFile (filename: string, data: string) {
        const savePath = path.join(this._unsyncFilesFolderPath, filename);
        fs.writeFileSync(savePath, data);
    }

    static checkOrCreateFileStructure (): void {
        const basePath = path.join(app.getPath('desktop'), 'revault')
        const syncFilesFolderPath = path.join(basePath, 'sync')
        const unsyncFilesFolderPath = path.join(basePath, 'unsync')
        
        !fs.existsSync(basePath) && fs.mkdirSync(basePath)
        !fs.existsSync(syncFilesFolderPath) && fs.mkdirSync(syncFilesFolderPath)
        !fs.existsSync(unsyncFilesFolderPath) && fs.mkdirSync(unsyncFilesFolderPath)

        const files = fs.readdirSync(basePath);

        files.forEach((file) => {
          const filePath = path.join(basePath, file);
  
          if (fs.statSync(filePath).isFile() && path.extname(file).toLowerCase() === '.csv') {
            const destinationPath = path.join(unsyncFilesFolderPath, file);
  
            fs.renameSync(filePath, destinationPath);
            console.log(`Arquivo movido: ${file} -> ${destinationPath}`);
          }
        });
    }

    static moveToSync (): void {
        const basePath = path.join(app.getPath('desktop'), 'revault')
        const syncFilesFolderPath = path.join(basePath, 'sync')
        const unsyncFilesFolderPath = path.join(basePath, 'unsync')
        
        !fs.existsSync(basePath) && fs.mkdirSync(basePath)
        !fs.existsSync(syncFilesFolderPath) && fs.mkdirSync(syncFilesFolderPath)
        !fs.existsSync(unsyncFilesFolderPath) && fs.mkdirSync(unsyncFilesFolderPath)

        const files = fs.readdirSync(unsyncFilesFolderPath);

        files.forEach((file) => {
          const filePath = path.join(unsyncFilesFolderPath, file);
  
          if (fs.statSync(filePath).isFile() && path.extname(file).toLowerCase() === '.csv') {
            const destinationPath = path.join(syncFilesFolderPath, file);
  
            fs.renameSync(filePath, destinationPath);
            console.log(`Arquivo movido: ${file} -> ${destinationPath}`);
          }
        });
    }

}
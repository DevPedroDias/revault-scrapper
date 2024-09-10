import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export default abstract class FileHandler {
    protected readonly _basePath: string
    constructor() {
        this._basePath = path.join(app.getPath('desktop'), 'revault')
        if (!fs.existsSync(this._basePath)) {
            fs.mkdirSync(this._basePath);
        }
    }

    protected writeFile (filename: string, data: string) {
        const savePath = path.join(this._basePath, filename);
        fs.writeFileSync(savePath, data);
    }
}
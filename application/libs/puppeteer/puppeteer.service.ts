import PuppeteerBrowserComponent from "./components/puppeteer.browser.component"
import { launch } from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import { downloadBrowsers } from 'puppeteer/internal/node/install.js'
export default class PuppeteerService {
    private _browser: PuppeteerBrowserComponent | undefined

    private async downloadBrowser(): Promise<void> {
        console.error('downloadding browser');
        await downloadBrowsers()
    }

    private isPuppeteerCacheNotEmpty(): boolean {
        try {
            const files = fs.readdirSync(path.join(process.env.HOME || process.env.USERPROFILE || '', '.cache', 'puppeteer'));
            return files && files.length > 0; // Retorna true se houver arquivos ou diretórios
        } catch (err) {
            console.error('Erro ao acessar o diretório de cache:', err);
            return false;
        }
    }

    async lauch (): Promise<PuppeteerBrowserComponent> {
        if(!this._browser) {
            !this.isPuppeteerCacheNotEmpty() && await this.downloadBrowser()
            const browserHandler = await launch({
                headless: 'shell',
                args: [
                    '--no-sandbox', 
                ],
                devtools: false
            })
            this._browser = new PuppeteerBrowserComponent(browserHandler)
        }
        return this._browser
    }

}
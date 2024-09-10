import PuppeteerBrowserComponent from "./components/puppeteer.browser.component"

export default class PuppeteerService {
    private _browser: PuppeteerBrowserComponent | undefined

    async lauch (): Promise<PuppeteerBrowserComponent> {
        if(!this._browser) {
            const { default: puppeteer } = await import('puppeteer');
            const browserHandler = await puppeteer.launch({
                headless: 'shell'
            })
            this._browser = new PuppeteerBrowserComponent(browserHandler)
        }
        return this._browser
    }
}
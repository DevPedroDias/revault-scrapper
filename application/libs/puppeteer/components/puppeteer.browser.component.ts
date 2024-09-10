import { Browser } from "puppeteer";
import PuppeteerPageComponent from "./puppeteer.page.component";

export default class PuppeteerBrowserComponent {
    _browserHandler: Browser

    constructor (browser: Browser) {
        this._browserHandler = browser
    }

    async executeOnPage<T>(ref: string, callback:(browser:PuppeteerBrowserComponent, page:PuppeteerPageComponent, args?: Record<string, unknown> ) => Promise<T>, args?: Record<string, unknown>): Promise<T> {
        const pageHandler = await this._browserHandler.newPage()
        const page = new PuppeteerPageComponent({
            ref,
            page: pageHandler
        })
        const response = await callback(this, page, args)
        await pageHandler.close()
        return response as T
    }
}
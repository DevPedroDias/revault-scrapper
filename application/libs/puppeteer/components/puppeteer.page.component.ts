import { ElementHandle, KeyInput, Page } from "puppeteer"
import MetaParams from "./object-values/meta.params"

export default class PuppeteerPageComponent {
    private _ref: string
    private _pageHanlder: Page

    constructor(pageProperties: { ref:string, page: Page }) {
        this._pageHanlder = pageProperties.page
        this._ref = pageProperties.ref
    }

    get ref (): string {
        return this._ref
    }

    async goTo (url: string): Promise<PuppeteerPageComponent> {
        await this._pageHanlder?.goto(url)
        return this
    }

    async click (elementRef: string): Promise<PuppeteerPageComponent> {
        await this._pageHanlder?.click(elementRef)
        return this
    }

    async waitForSelector (elementRef: string): Promise<PuppeteerPageComponent> {
        await this._pageHanlder?.waitForSelector(elementRef)
        return this
    }

    async pressKey (keyRef: KeyInput): Promise<PuppeteerPageComponent> {
        await this._pageHanlder?.keyboard.press(keyRef)
        return this
    }

    async returnMatchAsArray<T> (keyRef: string, callback: (values:unknown[], args?: MetaParams) => string[] | unknown[] | unknown, args?: MetaParams): Promise<T> {
        const response = await this._pageHanlder?.$$eval(keyRef, callback, args)
        return response as T
    }

    async type (elementRef: string, value: string): Promise<PuppeteerPageComponent> {
        await this._pageHanlder?.type(elementRef, value)
        return this
    }

    async getElementContentByRef (elementRef: string): Promise<string | null> {
        let response = null
        const evokedElement = await this._pageHanlder.$(elementRef)
        if (evokedElement) {
            response = await evokedElement.evaluate(e => e.textContent)
        }

        return response
    }

    async getElementByRef (elementRef: string): Promise<ElementHandle<Element> | null> {
        const evokedElement = await this._pageHanlder.$(elementRef)
        return evokedElement
    }

    async sleep(timer: number): Promise<PuppeteerPageComponent> {
        return await new Promise(resolve => setTimeout(() => {
            resolve(this);
        }, timer));
    }
}
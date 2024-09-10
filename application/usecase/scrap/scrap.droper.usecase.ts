import CSVFileHandler from "../../libs/file-handler/csv.file.handler";
import MetaParams from "../../libs/puppeteer/components/object-values/meta.params";
import PuppeteerBrowserComponent from "../../libs/puppeteer/components/puppeteer.browser.component";
import PuppeteerPageComponent from "../../libs/puppeteer/components/puppeteer.page.component";
import PuppeteerService from "../../libs/puppeteer/puppeteer.service";
import UsecaseByEvent from "../usecase.by.event";
import { SinglePageDataOutput, SitemapRef, SinglePageDetailsDataOutput, SinglePageDetailsElementsMapRef, DROPER_BASE_URL } from "./droper.element.sitemap";
import { StatusScrap } from '../../domain/value-objects/status.scrap';
import CreateScrapLogUseCase from "../save-scrap-logger/create.scrap.log.usecase";
import SneakerRepository from "../../libs/sqlite/repository/sneaker.repository";

export default class ScrapDroperUsecase extends UsecaseByEvent {
    private readonly productsByPageNumber = 48;
    constructor(
        private readonly puppeteerService: PuppeteerService,
        private readonly saveScrapLoggerUsecase: CreateScrapLogUseCase,
        private readonly sneakerRepository: SneakerRepository,
    ) {
        super();
    }

    async execute (input: ScrapDroperUsecaseInput) {
        try {
            const logId = await this.saveScrapLoggerUsecase.execute({
                newStatus: { type: StatusScrap.started }, 
                inputArgs: { input }
            })
            this.updateStatus({ type: StatusScrap.started, logId })
            const browser = await this.puppeteerService.lauch()
            const sneakerLoggerData: {
                sku?:string,
                name?:string,
            }[] = []
            let totalSneakersFound = 0;
            let missingResults = input.maxResults;

            const sneakers = await browser.executeOnPage<SinglePageDataOutput[]>('searchPage', async (browser, page): Promise<SinglePageDataOutput[]> => {
                this.updateStatus({ type: StatusScrap.inProgess, logId, message: 'Searching results...' })
                const sneakersFound: SinglePageDataOutput[] = []
                await page.goTo(SitemapRef.initUrl)
                await page.sleep(5000)
                await page.click(SitemapRef.openFiltersSelector)
                await page.waitForSelector(SitemapRef.openOrdernationTypeSelector)
                await page.click(SitemapRef.openOrdernationTypeSelector);
                await page.click(SitemapRef.mostExpansiveOrdernationTypeSelector);
                await page.click(SitemapRef.openCategoryTypeSelector);
                await page.waitForSelector(SitemapRef.categoryTypeSelector)
                await page.click(SitemapRef.categoryTypeSelector);
                await page.click(SitemapRef.closeFilterSelector);
                await page.type(SitemapRef.searchFieldSelector, input.keyword);
                await page.pressKey('Enter');
                await page.waitForSelector(SitemapRef.productCellSelector);
                const singleProductLinks = await this.scrapSinglePageLink(page)
                for (let index = 0; index < singleProductLinks.length && totalSneakersFound < input.maxResults && index < this.productsByPageNumber; index++) {
                    const link = singleProductLinks[index];
                    const sneaker = await this.scrapSinglePage(`${DROPER_BASE_URL}${link}`, browser);
                    console.log(sneaker)
                    if (sneaker) {
                        const isDuplicate = await this.checkIfSneakerExists(sneaker.details.sku); // Checa se já está salvo
                        if (!isDuplicate) {
                            const sneakerData = {
                                sku: sneaker.details.sku as string,
                                name: sneaker.name,
                                log_id: logId
                              }
                              page.sleep(1000)
                              await this.sneakerRepository.createSneaker(sneakerData)
                            sneakersFound.push(sneaker);
                            sneakerLoggerData.push({
                                sku: sneaker.details.sku || undefined,
                                name: sneaker.name,
                            });
                            totalSneakersFound++;
                            missingResults--; // Decrementa a quantidade de resultados faltantes
                            this.updateStatus({ type: StatusScrap.inProgess, message: `Sneaker added: ${totalSneakersFound}/${input.maxResults}`, logId });
                        } else {
                            this.updateStatus({ type: StatusScrap.inProgess, message: `Duplicate sneaker skipped: ${index + 1}`, logId });
                        }
                    }
                }
                return sneakersFound
            }, SitemapRef)
            await browser._browserHandler.close()
            this.updateStatus({ type: StatusScrap.savingFile, logId })
            const fileHandler = new CSVFileHandler()
            const csvData = fileHandler.rawToCSV(sneakers)
            const filename = fileHandler.writeCSVFile('sneakersFound', csvData)
            this.updateStatus({ type: StatusScrap.finished, logId })
            this.makeRegisterLog({status: { type: StatusScrap.finished, logId }, registerData: {input, filename}})
        } catch (error) {
            const castedError = error as Error
            this.updateStatus({ type: StatusScrap.error, message: castedError.message })
        }
    }

    private async checkIfSneakerExists(sku: string | null): Promise<boolean> {
        if (!sku) return false;
        return await this.sneakerRepository.alreadyHasSKU(sku)
    }

    private async scrapSinglePageLink (page: PuppeteerPageComponent): Promise<string[]> {
        return await page.returnMatchAsArray<string[]>(SitemapRef.productCellSelector, (productCards, args) => {
            if (!args) return null
            const paramsArgs = args.params as Record<string, string>
            return productCards.map(card  => {
                const sanCard = card as Element
                const pageLink = sanCard?.querySelector(paramsArgs.productCellHeaderSelector)?.getAttribute('href');
                return pageLink
            }) as string []
        }, new MetaParams(SitemapRef))
    }

    private async scrapSinglePage (url: string, browser: PuppeteerBrowserComponent): Promise<SinglePageDataOutput | null> {
        const singleSneakerOutput = await browser.executeOnPage<SinglePageDataOutput | null>('singlePage', async (_, page): Promise<SinglePageDataOutput | null> => {
            await page.goTo(url)
            await page.sleep(2000)
            await page.click(SitemapRef.datailsSeeMoreButton)
            await page.sleep(500)
            const detailsBoxElement = await page.getElementByRef(SitemapRef.datailsSinglePageBox)
            const detailsCells = await detailsBoxElement?.$$(SitemapRef.datailsSinglePage)
            if(!detailsCells) return null

            const outputData: SinglePageDetailsDataOutput = {
                sku: null,
                releaseDate: null,
                brand: null,
                silhouette: null,
                releasePrice: null,
                color: null
            }

            for (let index = 0; index < detailsCells.length; index++) {
                const element = detailsCells[index];
                const titleValue = await element.$(SitemapRef.datailsSinglePageTitle).then(async (el) => await el?.evaluate(e => e.textContent))
                if (titleValue) {
                    const sanitizedTitleValue = titleValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/\s+/g, "")
                    const detailRef = SinglePageDetailsElementsMapRef[sanitizedTitleValue]
                    outputData[detailRef.keyRef as keyof SinglePageDetailsDataOutput] =  await element.$(detailRef.elementValueRef).then(async (el) => await el?.evaluate(e => e.textContent)) || null
                }
            }

            const imageLinks = await page.returnMatchAsArray<string[]>(SitemapRef.imageElementSinglePage, this.scrapSinglePageImages)
            const sneakerName = await page.getElementContentByRef(SitemapRef.nameElementSinglePage)
            const sneakerPrice = await page.getElementContentByRef(SitemapRef.priceElementSinglePage)
            const snekaerDescription = await page.getElementContentByRef(SitemapRef.descriptionElementSinglePage)
            const response: SinglePageDataOutput = {
                name: String(sneakerName),
                price: String(sneakerPrice),
                description: String(snekaerDescription),
                imageLinks: imageLinks,
                details: outputData
            }
            return response
        })
        return singleSneakerOutput
    }

    private async scrapSinglePageImages (rawPhotos: string | unknown[]) {
        const links: string[] = []
        for (let index = 0; index < rawPhotos.length; index++) {
            const photo = rawPhotos[index] as Element;
            links.push(String(photo.getAttribute('src')))
        }
        return links
    }
}
export type ScrapDroperUsecaseInput = {
    keyword: string,
    maxResults: number
}
import MetaParams from "../../libs/puppeteer/components/object-values/meta.params";
import PuppeteerBrowserComponent from "../../libs/puppeteer/components/puppeteer.browser.component";
import PuppeteerPageComponent from "../../libs/puppeteer/components/puppeteer.page.component";
import PuppeteerService from "../../libs/puppeteer/puppeteer.service";
import UsecaseByEvent from "../usecase.by.event";
import { SinglePageDataOutput, SitemapRef, SinglePageDetailsDataOutput, SinglePageDetailsElementsMapRef, DROPER_BASE_URL } from "./droper.element.sitemap";
import SneakerRepository from "../../libs/sqlite/repository/sneaker.repository";
import LoggerRepository from "../../libs/sqlite/repository/logger.repository";
import Search, { SearchStatus } from "../../domain/entity/search";
import Sneaker from "../../domain/entity/sneaker";

export default class ScrapDroperUsecase extends UsecaseByEvent {
    private readonly productsByPageNumber = 48;
    constructor(
        private readonly puppeteerService: PuppeteerService,
        private readonly loggerRepository: LoggerRepository,
        private readonly sneakerRepository: SneakerRepository,
    ) {
        super();
    }

    async execute (input: ScrapDroperUsecaseInput) {
        try {
            const searchEntity = new Search({
                status: SearchStatus.started,
                keyword: input.keyword,
                quantity: input.maxResults
            })
            searchEntity.id = await this.loggerRepository.create(searchEntity)

            this.updateStatus(searchEntity)
            const browser = await this.puppeteerService.lauch()
            let totalSneakersFound = 0;
            let duplicatedSneakers = 0;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let missingResults = input.maxResults;

            const sneakers = await browser.executeOnPage<Sneaker[]>('searchPage', async (browser, page): Promise<Sneaker[]> => {
                searchEntity.status = SearchStatus.inProgess
                searchEntity.message = 'Searching results...'
                this.updateStatus(searchEntity)

                const sneakersFound: Sneaker[] = []
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
                    const sneaker = await this.scrapSinglePage(`${DROPER_BASE_URL}${link}`, browser, Number(searchEntity.id));
                    if (sneaker) {
                        const isDuplicate = await this.checkIfSneakerExists(sneaker.sku);
                        if (!isDuplicate) {
                              page.sleep(1000)
                              await this.sneakerRepository.createSneaker(sneaker)
                            sneakersFound.push(sneaker);
                            totalSneakersFound++;
                            missingResults--;

                            searchEntity.status = SearchStatus.inProgess
                            searchEntity.message = `Sneaker added: ${totalSneakersFound}/${input.maxResults}`
                            this.updateStatus(searchEntity)
                        } else {
                            duplicatedSneakers++
                            searchEntity.status = SearchStatus.inProgess
                            searchEntity.message = `Duplicate sneaker skipped: ${duplicatedSneakers}`
                            this.updateStatus(searchEntity)
                        }
                    }
                }
                return sneakersFound
            }, SitemapRef)
            await browser._browserHandler.close()
            searchEntity.status = SearchStatus.finished
            searchEntity.message = `Total results collected: ${sneakers.length}/${input.maxResults}`
            this.updateStatus(searchEntity)
            this.loggerRepository.update(searchEntity)

        } catch (error) {
            const castedError = error as Error
            this.updateStatus(new Search({
                status: SearchStatus.error,
                keyword: input.keyword,
                quantity: input.maxResults,
                message: castedError.message
            }))
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

    private async scrapSinglePage (url: string, browser: PuppeteerBrowserComponent, searchId: number): Promise<Sneaker | null> {
        const singleSneakerOutput = await browser.executeOnPage<SinglePageDataOutput | null>('singlePage', async (_, page): Promise<SinglePageDataOutput | null> => {
            await page.goTo(url)
            await page.sleep(2000)
            // await page.click(SitemapRef.datailsSeeMoreButton)
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
        return new Sneaker({
            sku: String(singleSneakerOutput?.details.sku),
            price: String(singleSneakerOutput?.price),
            description: String(singleSneakerOutput?.description),
            imageLinks: String(singleSneakerOutput?.imageLinks),
            releaseDate: String(singleSneakerOutput?.details.releaseDate),
            brand: String(singleSneakerOutput?.details.brand),
            silhouette: String(singleSneakerOutput?.details.silhouette),
            releasePrice: String(singleSneakerOutput?.details.releasePrice),
            color: String(singleSneakerOutput?.details.color),
            name: String(singleSneakerOutput?.name),
            synced: 0,
            searchId,
        })
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
import PuppeteerService from "../../libs/puppeteer/puppeteer.service";
import SneakerRepository from "../../libs/sqlite/repository/sneaker.repository";
import CreateScrapLogUseCaseFactory from "../save-scrap-logger/create.scrap.log.usecase.factory";
import ScrapDroperUsecase from "./scrap.droper.usecase";

export default class ScrapDroperUsecaseFactory {
    static build(): ScrapDroperUsecase {
        const saveScrapLoggerUsecase = CreateScrapLogUseCaseFactory.build()
        const puppeteerService = new PuppeteerService()
        const sneakerRepository = new SneakerRepository()
        return new ScrapDroperUsecase(puppeteerService, saveScrapLoggerUsecase, sneakerRepository)
    }
}
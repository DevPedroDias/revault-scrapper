import PuppeteerService from "../../libs/puppeteer/puppeteer.service";
import LoggerRepository from "../../libs/sqlite/repository/logger.repository";
import SneakerRepository from "../../libs/sqlite/repository/sneaker.repository";
import ScrapDroperUsecase from "./scrap.droper.usecase";

export default class ScrapDroperUsecaseFactory {
    static build(): ScrapDroperUsecase {
        const loggerRepository = new LoggerRepository()
        const puppeteerService = new PuppeteerService()
        const sneakerRepository = new SneakerRepository()
        return new ScrapDroperUsecase(puppeteerService, loggerRepository, sneakerRepository)
    }
}
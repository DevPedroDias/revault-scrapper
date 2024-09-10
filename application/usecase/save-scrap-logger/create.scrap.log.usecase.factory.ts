import LoggerRepository from "../../libs/sqlite/repository/logger.repository";
import CreateScrapLogUseCase from "./create.scrap.log.usecase";

export default class CreateScrapLogUseCaseFactory {
    static build(): CreateScrapLogUseCase {
        const loggerRepository = new LoggerRepository()
        return new CreateScrapLogUseCase(loggerRepository)
    }
}
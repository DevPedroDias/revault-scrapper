import LoggerRepository from "../../libs/sqlite/repository/logger.repository";
import UpdateScrapLogUseCase from "./update.scrap.log.usecase";

export default class UpdateScrapLogUseCaseFactory {
    static build(): UpdateScrapLogUseCase {
        const loggerRepository = new LoggerRepository()
        return new UpdateScrapLogUseCase(loggerRepository)
    }
}
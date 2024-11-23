import LoggerRepository from "../../libs/typeorm/repository/logger.repository";
import ListLogsUseCase from "./list.logs.usecase";

export default class ListLogsUseCaseFactory {
    static build(): ListLogsUseCase {
        const loggerRepository = new LoggerRepository()
        return new ListLogsUseCase(loggerRepository)
    }
}
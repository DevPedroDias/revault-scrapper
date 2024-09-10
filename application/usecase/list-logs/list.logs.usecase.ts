import LoggerRepository, { SearchLoggerDTO } from "../../libs/sqlite/repository/logger.repository"

export default class ListLogsUseCase {
    constructor (
        private readonly logRepository: LoggerRepository
    ){}
    async execute (): Promise<SearchLoggerDTO[]> {
        const logs = await this.logRepository.getAll()
        return logs
    }
}

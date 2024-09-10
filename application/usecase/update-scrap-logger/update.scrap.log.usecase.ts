import LoggerRepository, { SearchLoggerDTO } from "../../libs/sqlite/repository/logger.repository"

export default class UpdateScrapLogUseCase {
    constructor (
        private readonly logRepository: LoggerRepository
    ){}
    async execute (input: UpdateScrapLogUseCaseInput): Promise<void> {
        await this.logRepository.update(input.log)
    }
}
export type UpdateScrapLogUseCaseInput = {
    log: SearchLoggerDTO
}
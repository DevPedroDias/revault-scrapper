import { StatusScrap } from "../../domain/value-objects/status.scrap"
import LoggerRepository from "../../libs/sqlite/repository/logger.repository"

export default class CreateScrapLogUseCase {
    constructor (
        private readonly logRepository: LoggerRepository
    ){}
    async execute (input: CreateScrapLogUseCaseInput): Promise<number> {
        const logData = {
            status: input.newStatus.type,
            input: input.inputArgs.input.keyword as string,
            filename: input.inputArgs.filename || undefined,
            search_quantity: input.inputArgs.input.maxResults as number,
            message: input.newStatus.message
          }
        const loggerId = await this.logRepository.create(logData)
        return loggerId
    }
}
export type CreateScrapLogUseCaseInput = {
    newStatus: { type: StatusScrap, message?: string }, 
    inputArgs: {input: Record<string, unknown>, filename?: string}
}
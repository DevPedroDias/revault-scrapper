import { ScrapStatusProcess } from "../../domain/value-objects/scrap.status.process";
import CreateManySneakersUseCase from "../save-many-sneakers/create.many.sneakers.usecase";
import CreateScrapLogUseCase from "../save-scrap-logger/create.scrap.log.usecase";
import UpdateScrapLogUseCase from "../update-scrap-logger/update.scrap.log.usecase";

export default class PostProcessScrapUseCase {
    constructor (
        private readonly saveScrapLoggerUsecase: CreateScrapLogUseCase,
        private readonly updateScrapLoggerUsecase: UpdateScrapLogUseCase,
        private readonly saveManySneakersUsecase: CreateManySneakersUseCase
    ){}
    async execute (input: PostProcessScrapUseCaseInput): Promise<void> {
        let loggerId = input.newStatus.logId
        if (input.newStatus.logId) {
            const data = {
                log: {
                    id: input.newStatus.logId,
                    status: input.newStatus.type,
                    message: input.newStatus.message,
                    filename: input.inputArgs.filename
                }
            }
            await this.updateScrapLoggerUsecase.execute(data)
        } else {
            loggerId = await this.saveScrapLoggerUsecase.execute(input)
        }

        if (input.sneakers?.length) {
            await this.saveManySneakersUsecase.execute({
                inputArgs: input.sneakers, 
                logId: Number(loggerId)
            })
        }
    }
}
export type PostProcessScrapUseCaseInput = {
    newStatus: ScrapStatusProcess, 
    inputArgs: {input: Record<string, unknown>, filename: string},
    sneakers: Record<string, unknown>[]
}
import SneakerRepository from "../../libs/sqlite/repository/sneaker.repository"

export default class CreateManySneakersUseCase {
    constructor (
        private readonly sneakerRepository: SneakerRepository
    ){}
    async execute (input: CreateManySneakersUseCaseInput): Promise<void> {
        const logData = []
 
        for (let index = 0; index < input.inputArgs.length; index++) {
            const element = input.inputArgs[index];
            logData.push({
                sku: element.sku as string,
                name: element.name as string,
                log_id: input.logId
              })

        }

        await this.sneakerRepository.createManySneakers(logData)
    }
}
export type CreateManySneakersUseCaseInput = {
    inputArgs: Record<string, unknown>[],
    logId: number
}
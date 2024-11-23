import Sneaker from "../../domain/entity/sneaker"
import SneakerRepository from "../../libs/typeorm/repository/sneaker.repository"

export default class ListSneakersUseCase {
    constructor (
        private readonly sneakerRepository: SneakerRepository
    ){}
    async execute (input: ListSneakersUseCaseInput): Promise<{ data: Sneaker[]; total: number; totalPages: number }> {
        const sneakersData = await this.sneakerRepository.page(input.page, input.filters)
        return sneakersData
    }
}

export type ListSneakersUseCaseInput = {
    page: number,
    filters?: {
        isSynced?: boolean
    }
}

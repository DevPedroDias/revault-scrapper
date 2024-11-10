import Sneaker from "../../domain/entity/sneaker"
import SneakerRepository from "../../libs/sqlite/repository/sneaker.repository"

export default class ListSneakersUseCase {
    constructor (
        private readonly sneakerRepository: SneakerRepository
    ){}
    async execute (input: ListSneakersUseCaseInput): Promise<{ data: Sneaker[]; total: number; totalPages: number }> {
        console.log('teseeeeeeeeeeeeeeeeeeeeeeeeeeeeee', input)
        const sneakersData = await this.sneakerRepository.page(input.page)
        console.log('tenis achados no esquema', sneakersData)
        return sneakersData
    }
}

export type ListSneakersUseCaseInput = {
    page: number
}

import SneakerRepository from "../../libs/typeorm/repository/sneaker.repository"
import ListSneakersUseCase from "./list.sneakers.usecase"

export default class ListSneakersUseCaseFactory {
    static build(): ListSneakersUseCase {
        const sneakerRepository = new SneakerRepository()
        return new ListSneakersUseCase(sneakerRepository)
    }
}
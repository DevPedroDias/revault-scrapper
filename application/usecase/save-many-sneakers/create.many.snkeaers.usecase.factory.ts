import SneakerRepository from "../../libs/sqlite/repository/sneaker.repository";
import CreateManySneakersUseCase from "./create.many.sneakers.usecase";

export default class CreateManySneakersUseCaseFactory {
    static build(): CreateManySneakersUseCase {
        const sneakerRepository = new SneakerRepository()
        return new CreateManySneakersUseCase(sneakerRepository)
    }
}
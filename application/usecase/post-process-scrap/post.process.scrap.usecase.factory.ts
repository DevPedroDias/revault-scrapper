import CreateManySneakersUseCaseFactory from "../save-many-sneakers/create.many.snkeaers.usecase.factory";
import CreateScrapLogUseCaseFactory from "../save-scrap-logger/create.scrap.log.usecase.factory";
import UpdateScrapLogUseCaseFactory from "../update-scrap-logger/update.scrap.log.usecase.factory";
import PostProcessScrapUseCase from "./post.process.scrap.usecase";

export default class PostProcessScrapUseCaseFactory {
    static build(): PostProcessScrapUseCase {
        const saveScrapLoggerUsecase = CreateScrapLogUseCaseFactory.build()
        const updateScrapLoggerUsecase = UpdateScrapLogUseCaseFactory.build()
        const saveManySneakersUsecase = CreateManySneakersUseCaseFactory.build()
        return new PostProcessScrapUseCase(saveScrapLoggerUsecase, updateScrapLoggerUsecase, saveManySneakersUsecase)
    }
}
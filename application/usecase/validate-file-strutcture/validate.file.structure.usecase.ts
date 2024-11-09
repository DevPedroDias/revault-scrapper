import FileHandler from "../../libs/file-handler/file.handler"

export default class ValidateFileStructureUsecase {
    constructor (){}
    async execute (): Promise<void> {
        FileHandler.checkOrCreateFileStructure()
    }
}

import FileHandler from "../../libs/file-handler/file.handler"

export default class SyncFilesUsecase {
    constructor (){}
    async execute (): Promise<void> {
        FileHandler.moveToSync()
    }
}

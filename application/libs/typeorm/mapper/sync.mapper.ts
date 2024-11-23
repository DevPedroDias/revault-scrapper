import Sync from "../../../domain/entity/sync"
import { SyncModel } from "../model/sync.model"

export default class SyncMapper {
    static toEntity(model: SyncModel): Sync {
        return new Sync({
            id: model.id,
            status: model.status,
            quantity: model.quantity,
            userId: model.userId
        })
    }

    static toModel(entity: Sync): SyncModel {
        const model = new SyncModel()
        model.status = entity.status
        model.userId = entity.userId
        model.quantity = entity.quantity

        if (entity.id) model.id = entity.id

        return model

    }
}
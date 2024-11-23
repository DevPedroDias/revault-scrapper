import Sneaker from "../../../domain/entity/sneaker"
import { SneakerModel } from "../model/sneaker.model"

export default class SneakerMapper {
    static toEntity(model: SneakerModel): Sneaker {
        return new Sneaker({
            id: model.id,
            sku: model.sku,
            name: model.name,
            price: model.price,
            description: model.description,
            imageLinks: model.imageLinks,
            releaseDate: model.releaseDate,
            brand: model.brand,
            silhouette: model.silhouette,
            releasePrice: model.releasePrice,
            color: model.color,
            searchId: model.searchId,
            synced: model.synced,
        })
    }

    static toModel(entity: Sneaker): SneakerModel {
        const model = new SneakerModel()
        model.sku = entity.sku
        model.searchId = entity.searchId
        model.name = entity.name
        model.price = entity.price
        model.description = entity.description
        model.imageLinks = entity.imageLinks.join(',')
        model.releaseDate = entity.releaseDate
        model.brand = entity.brand
        model.silhouette = entity.silhouette
        model.releasePrice = entity.releasePrice
        model.color = entity.color
        model.synced = entity.synced

        if (entity.id) model.id = entity.id
        return model

    }
}
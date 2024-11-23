import Search from "../../../domain/entity/search";
import { SearchModel } from "../model/search.model";

export default class SearchMapper {
    static toEntity(model: SearchModel): Search {
        return new Search({
            id: model.id,
            status: model.status,
            keyword: model.input,
            quantity: model.searchQuantity,
            message: model.message
        })
    }

    static toModel(entity: Search): SearchModel {
        const model = new SearchModel()
        model.input = entity.keyword
        model.searchQuantity = entity.quantity
        model.status = entity.status

        if (entity.message) {
            model.message = entity.message
        }
        if (entity.id) {
            model.id = entity.id
        }

        return model

    }
}
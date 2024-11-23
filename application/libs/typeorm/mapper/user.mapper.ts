import User from "../../../domain/entity/user"
import { UserModel } from "../model/user.model"

export default class UserMapper {
    static toEntity(model: UserModel): User {
        return new User({
            id: model.id,
            name: model.name,
            email: model.email,
            apiKey: model.apiKey
        })
    }

    static toModel(entity: User): UserModel {
        const model = new UserModel()
        model.name = entity.name
        model.apiKey = entity.apiKey
        model.email = entity.email

        if (entity.id) model.id = entity.id

        return model

    }
}
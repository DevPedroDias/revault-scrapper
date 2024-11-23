export type UserProperties = {
    id?: number
    name: string
    email: string
    apiKey: string
}
export default class User {
    readonly id?: number
    readonly name: string
    readonly email: string
    readonly apiKey: string
    constructor(properties: UserProperties ) {
        this.id = properties.id
        this.name = properties.name
        this.email = properties.email
        this.apiKey = properties.apiKey
    }
}

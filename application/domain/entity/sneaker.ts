export type SneakerProperties = {
    id?: number,
    sku: string,
    name: string,
    price: string,
    description: string,
    imageLinks: string,
    releaseDate: string,
    brand: string,
    silhouette: string,
    releasePrice: string,
    color: string,
    searchId: number,
    synced: number,
}
export default class Sneaker {
    id?: number
    readonly sku: string
    readonly price: string
    readonly name: string
    readonly description: string
    readonly imageLinks: string[]
    readonly releaseDate: string
    readonly brand: string
    readonly silhouette: string
    readonly releasePrice: string
    readonly color: string
    readonly searchId: number
    readonly synced: number
    constructor(properties: SneakerProperties ) {
        this.id = properties.id
        this.sku = properties.sku
        this.price = properties.price
        this.name = properties.name
        this.description = properties.description
        this.imageLinks = properties.imageLinks.split(',')
        this.releaseDate = properties.releaseDate
        this.brand = properties.brand
        this.silhouette = properties.silhouette
        this.releasePrice = properties.releasePrice
        this.color = properties.color
        this.searchId = properties.searchId
        this.synced = properties.synced
    }
}
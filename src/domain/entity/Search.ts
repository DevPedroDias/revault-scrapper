export type SearchProperties = {
    id?: number,
    status: SearchStatus,
    keyword: string,
    quantity: number,
    message?: string
}
export default class Search {
    readonly keyword: string
    readonly quantity: number
    id?: number
    status: SearchStatus
    message?: string
    constructor(properties: SearchProperties ) {
        this.id = properties.id
        this.keyword = properties.keyword
        this.quantity = properties.quantity
        this.status = properties.status
        this.message = properties.message
    }
}

export enum SearchStatus {
    started = 'STARTED',
    inProgess = 'IN_PROGRESS',
    finished = 'FINISHED',
    error = 'ERROR',
}
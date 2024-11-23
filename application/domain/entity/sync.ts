export type SyncProperties = {
    id?: number
    status: SyncStatus
    quantity: number
    userId: number
}
export default class Sync {
    readonly id?: number
    status: SyncStatus
    readonly quantity: number
    readonly userId: number
    constructor(properties: SyncProperties ) {
        this.id = properties.id
        this.quantity = properties.quantity
        this.status = properties.status
        this.userId = properties.userId
    }
}

export enum SyncStatus {
    started = 'STARTED',
    inProgess = 'IN_PROGRESS',
    finished = 'FINISHED',
    error = 'ERROR',
}
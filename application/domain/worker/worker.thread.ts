import { ListnerConfigOptions } from "./base.worker.thread"

export default interface WorkerThread {
    getReference(): string
    execute (args: Record<string, unknown>): Promise<void>
    startListners(listnersConfigs: ListnerConfigOptions[]): void
}
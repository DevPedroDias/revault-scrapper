import UsecaseByEvent from "../../usecase/usecase.by.event";

export default abstract class BaseWorkerThread {
    protected readonly threadEvent: UsecaseByEvent
    constructor(threadEvent: UsecaseByEvent ) {
        this.threadEvent = threadEvent
    }
    startListners(listnersConfigs: ListnerConfigOptions[]): void {
        for (let index = 0; index < listnersConfigs.length; index++) {
            const config = listnersConfigs[index];
            this.threadEvent.on(config.refKey, config.callback)
        }
    }

    interceptEvent (): UsecaseByEvent {
        return this.threadEvent
    }
}

export type ListnerConfigOptions = {
    refKey: string
    callback: (data: Record<string, unknown>) => Promise<void>
}
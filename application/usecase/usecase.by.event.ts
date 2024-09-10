import { EventEmitter } from 'events';
import { ScrapStatusProcess } from '../domain/value-objects/scrap.status.process';

export default abstract class UsecaseByEvent extends EventEmitter {
    abstract execute (input: Record<string, unknown>): Promise<void>
    protected updateStatus(newStatus: ScrapStatusProcess): void {
        this.emit('updateStatus', newStatus)
    }
    protected makeRegisterLog(input: MakeRegisterLogInput): void {
        this.emit('post-processing-logger', input)
    }
}
 export type MakeRegisterLogInput = {
    status: ScrapStatusProcess,
    registerData: Record<string, unknown>
 }
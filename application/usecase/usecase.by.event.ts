import { EventEmitter } from 'events';
import Search from '../domain/entity/search';

export default abstract class UsecaseByEvent extends EventEmitter {
    abstract execute (input: Record<string, unknown>): Promise<void>
    protected updateStatus(search: Search): void {
        this.emit('updateStatus', search)
    }
}
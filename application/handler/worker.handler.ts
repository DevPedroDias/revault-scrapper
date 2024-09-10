import { Worker } from "node:worker_threads";
import WorkerThread from "../domain/worker/worker.thread";

export default class WorkerHandler  {
    readonly threadEntity: WorkerThread
    readonly worker: Worker
    readonly workerDataArgs: Record<string, unknown>
    constructor (workerThreadEntity: WorkerThread, args: Record<string, unknown>) {
        this.threadEntity = workerThreadEntity
        this.workerDataArgs = args
        this.worker = new Worker(this.buildStarterCodeWoker(), {
            workerData: args,
            eval: true
        })
    }

    startWorkerAction(): void {
        this.worker.on('message', async (message: MessageWorkerInput) => {
            switch (message.actionRef) {
                case this.threadEntity.getReference():
                    await this.executeReference()
                    break;
                default:
                    break;
            }
        });

        this.worker.on('error', (error) => {
            console.error('Erro no worker:', error);
        });

        this.worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker parou com código de saída ${code}`);
            }
        });
    }

    private buildStarterCodeWoker (): string {
        const workerCode = `
            const { parentPort } = require('worker_threads');
            parentPort.postMessage({actionRef: '${this.threadEntity.getReference()}'});
        `;
        return workerCode
    }

    private async executeReference (): Promise<void> {
        try {
            console.log('Iniciando o processo de scraping no processo principal...');
            await this.threadEntity.execute(this.workerDataArgs)
            this.worker.postMessage('Scraping concluído com sucesso.');
        } catch (error) {
            console.error('Erro no processo principal:', error);
            const e = error as Error
            this.worker.postMessage({ error: 'Erro no processo principal: ' + e.message });
        }
    }
}
type MessageWorkerInput = {
    actionRef: string,
    message?: string
}
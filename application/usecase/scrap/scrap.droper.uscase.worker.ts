import WorkerThread from "../../domain/worker/worker.thread";
import BaseWorkerThread from "../../domain/worker/base.worker.thread";
import { ScrapDroperUsecaseInput } from "./scrap.droper.usecase";
import ScrapDroperUsecaseFactory from "./scrap.droper.usecase.factory";

export default class ScrapDroperUsecaseWorker extends BaseWorkerThread implements WorkerThread {
  readonly actionRef = 'start-droper-scrapping'
  constructor() {
    super(ScrapDroperUsecaseFactory.build())
  }

  getReference(): string {
    return this.actionRef
  }

  async execute (args: Record<string, unknown>): Promise<void> {
    await this.threadEvent.execute(args as ScrapDroperUsecaseInput);
  }
}
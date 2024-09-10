import { StatusScrap } from "./status.scrap";

export type ScrapStatusProcess = { 
    type: StatusScrap, 
    message?: string,
    logId?:number
}
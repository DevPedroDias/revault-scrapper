import { electronPreload } from "./electron/electron.preload";

export const preloads = {
    ...electronPreload
}
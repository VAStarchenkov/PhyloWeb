import type { AppConfig } from "./config";

declare global {
    interface Window {
        __APP_JSON__?: unknown;
    }
}

export {};

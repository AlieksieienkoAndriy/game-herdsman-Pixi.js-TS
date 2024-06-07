import { Subscription } from "./helpers";

export class Listener {
    private static instance: Listener;

    public static getInstance(): Listener {
        if (!Listener.instance) {
            Listener.instance = new Listener();
        }
        return Listener.instance
    }

    handlers: any = {}

    constructor() {
    }

    add({event, func, context}: Subscription) {
        const handler = func.bind(context);
        this.handlers[event] = handler;
        window.addEventListener(event, handler);
    }
    
    dispath(event: CustomEvent) {
        window.dispatchEvent(event);
    }

    remove({event}: Subscription) {
        const handler = this.handlers[event];
        window.removeEventListener(event, handler);

        delete this.handlers[event];
    }

    clear() {
        this.handlers = {}
    }

}

declare global {
    interface Window {
        chrome: Chrome;
    }

    interface Chrome {
        webview: WebView2;
    }

    interface WebView2 {
        postMessage(message: any): void;
        postMessageWithAdditionalObjects(message: any, additionalObjects: ArrayLike<any>): void;
        // addEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
        releaseBuffer(buffer: ArrayBuffer): void;
    }
}

export { };
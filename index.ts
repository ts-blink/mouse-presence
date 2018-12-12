"use strict";

let onDisappearCallbacks: (() => void)[] = [];
let onAppearCallbacks: (() => void)[] = [];
let cursorIsVisible: boolean = true;

const MousePresence : any = {
    /**
     * Add a callback for the mouse disappear event
     * @Param {() => void} cb - The callback to be added
     * @Return {() => void} A deregisterer for the provided callback
     */
    onDisappear: (cb: () => void): () => void => {
        onDisappearCallbacks.push(cb);
        return () => { MousePresence.unregisterCallback(cb) };
    },

    /**
     * Add a callback for the mouse appear event
     * @Param {() => void} cb - The callback to be added
     * @Return {() => void} A deregisterer for the provided callback
     */
    onAppear: (cb: () => void): () => void => {
        onAppearCallbacks.push(cb);
        return () => { MousePresence.unregisterCallback(cb) };
    },

    /**
     * Remove a callback from both disappear and appear events (if exists)
     * @Param {() => void} target - The callback to be removed
     * @Return {void}
     */
    unregisterCallback: (target: () => void): void => {
        onDisappearCallbacks = onDisappearCallbacks.filter(cb => cb !== target);
        onAppearCallbacks = onAppearCallbacks.filter(cb => cb !== target);
    },

    /**
     * Dispatch a mouse disappear event and add a listener to dispatch a mouse appear event
     * @Return {void}
     */
    dispatchDisappear: (): void => {
        if(!cursorIsVisible) {
            return;
        }

        cursorIsVisible = false;
        onDisappearCallbacks.forEach(cb => cb());

        document.addEventListener("mousemove", () => {
            if(cursorIsVisible) {
                return;
            }

            cursorIsVisible = true;
            onAppearCallbacks.forEach(cb => cb());
        }, { once: true });
    },

    /**
     * Check if the mouse is present at time of calling
     * @Return {boolean} Whether the mouse is present
     */
    isPresent: (): boolean => {
        return cursorIsVisible;
    },

    /**
     * Add a keydown listener to the provided HTMLElement, which will trigger a dispatchDisappear
     * call when fired.
     * @Param {HTMLElement} el - The element for which the keydown listener should be added to
     * @Return {() => void} A deregisterer for the listener that will be attached
     */
    dispatchDisappearOnKeydown: (el: HTMLElement): () => void => {
        let listener = () => { MousePresence.dispatchDisappear() };
        el.addEventListener('keydown', listener);
        return () => { el.removeEventListener('keydown', listener) };
    }
};

export default MousePresence;

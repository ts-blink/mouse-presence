"use strict";

let onDisappearCallbacks: (() => void)[] = [];
let onAppearCallbacks: (() => void)[] = [];
let cursorIsVisible: boolean = true;

const MousePresence : any = {
    /**
     * Add a callback for the mouse disappear event
     * @Param {() => void} cb - The callback to be added
     * @Return {() => void} A reference to the same callback
     */
    onDisappear: (cb: () => void): () => void => {
        onDisappearCallbacks.push(cb);
        return cb;
    },

    /**
     * Add a callback for the mouse appear event
     * @Param {() => void} cb - The callback to be added
     * @Return {() => void} A reference to the same callback
     */
    onAppear: (cb: () => void): () => void => {
        onAppearCallbacks.push(cb);
        return cb;
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
        if(cursorIsVisible) {
            cursorIsVisible = false;
            onDisappearCallbacks.forEach(cb => cb());

            document.addEventListener("mousemove", () => {
                if(!cursorIsVisible) {
                    cursorIsVisible = true;
                    onAppearCallbacks.forEach(cb => cb());
                }
            }, { once: true });
        }
    },

    /**
     * Check if the mouse is present at time of calling
     * @Return {boolean} Whether the mouse is present
     */
    isPresentNow: (): boolean => {
        return cursorIsVisible;
    }
};

export default MousePresence;

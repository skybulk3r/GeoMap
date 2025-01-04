import { Observable } from '@nativescript/core';

class Store extends Observable {
    constructor() {
        super();
        this.state = {
            user: null,
            isAuthenticated: false
        };
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify(newState);
    }

    getState() {
        return this.state;
    }
}

const store = new Store();

export function initializeStore() {
    return store;
}

export default store;
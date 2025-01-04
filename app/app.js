import { Application } from '@nativescript/core';
import { initializeStore } from './store';

initializeStore();
Application.run({ moduleName: 'app-root' });
import { Observable } from '@nativescript/core';
import apiService from '../../services/api.service';

export class LoginViewModel extends Observable {
    constructor() {
        super();
        
        this.email = '';
        this.password = '';
        this.isLoading = false;
        this.errorMessage = '';
    }

    async onLogin() {
        if (!this.email || !this.password) {
            this.set('errorMessage', 'Please fill in all fields');
            return;
        }

        this.set('isLoading', true);
        this.set('errorMessage', '');

        try {
            await apiService.login(this.email, this.password);
            // Navigate to home page
            const frame = require('@nativescript/core').Frame;
            frame.topmost().navigate({
                moduleName: 'pages/home/home-page',
                clearHistory: true
            });
        } catch (error) {
            this.set('errorMessage', error.response?.data?.error || 'Login failed');
        } finally {
            this.set('isLoading', false);
        }
    }
}
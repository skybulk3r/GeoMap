import { Observable } from '@nativescript/core';
import apiService from '../../services/api.service';

export class HomeViewModel extends Observable {
    constructor() {
        super();
        this.flights = [];
        this.isLoading = false;
        this.activeFlights = 0;
        this.totalFlights = 0;
        this.loadFlights();
    }

    async loadFlights() {
        try {
            this.set('isLoading', true);
            const response = await apiService.getFlights();
            this.set('flights', response.data);
            
            // Update stats
            this.set('totalFlights', response.data.length);
            this.set('activeFlights', response.data.filter(f => f.status === 'active').length);
        } catch (error) {
            console.error('Failed to load flights:', error);
            // Show error dialog
            alert({
                title: "Error",
                message: "Failed to load flights. Please try again.",
                okButtonText: "OK"
            });
        } finally {
            this.set('isLoading', false);
        }
    }

    onViewFlight(args) {
        const flight = args.object.bindingContext;
        const frame = require('@nativescript/core').Frame;
        frame.topmost().navigate({
            moduleName: 'pages/flight-detail/flight-detail-page',
            context: { flightId: flight.id }
        });
    }

    onAddFlight() {
        const frame = require('@nativescript/core').Frame;
        frame.topmost().navigate('pages/flight-new/flight-new-page');
    }

    onLogout() {
        const frame = require('@nativescript/core').Frame;
        frame.topmost().navigate({
            moduleName: 'pages/login/login-page',
            clearHistory: true
        });
    }
}
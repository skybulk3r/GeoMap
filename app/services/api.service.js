import axios from 'axios';
import { getString, setString } from '@nativescript/core/application-settings';

const API_URL = 'http://localhost:3000/api';

class ApiService {
    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            timeout: 10000
        });
        
        this.setupInterceptors();
    }

    setupInterceptors() {
        this.client.interceptors.request.use(config => {
            const token = getString('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    async login(email, password) {
        const response = await this.client.post('/auth/login', { email, password });
        setString('authToken', response.data.token);
        return response.data;
    }

    async getFlights() {
        return await this.client.get('/flights');
    }
}

export default new ApiService();
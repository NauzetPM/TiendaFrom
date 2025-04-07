import axios from 'axios';
import { urlPeticiones } from '@/global.js';

const API_URL = urlPeticiones+'/api/auth/';
export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}login/`, { username, password });
        return response.data.token;
    } catch (error) {
        throw error.response?.data || { error: 'Error desconocido' };
    }
};
export const register = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}register/`, { username, email, password });
        return response.data.token;
    } catch (error) {
        throw error.response?.data || { error: 'Error desconocido' };
    }
};

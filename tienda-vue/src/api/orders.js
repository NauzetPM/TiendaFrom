import axios from 'axios';
import { urlPeticiones } from '@/global.js';
const API_URL = urlPeticiones+'/api/';
export const fetchOrders = async (token) => {
    try {
        const response = await axios.get(API_URL+'orders/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
import axios from 'axios';
import { urlPeticiones } from '@/global.js';
const API_URL = urlPeticiones+'/api/';
export const fetchProducts = async (filters = {}) => {
    try {
        const response = await axios.get(API_URL+'products/', { params: filters });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
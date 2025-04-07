import axios from 'axios';
import { urlPeticiones } from '@/global.js';
const API_URL = urlPeticiones+'/api/';
export const fetchCategories = async () => {
    try {
        const response = await axios.get(API_URL+'categories/');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
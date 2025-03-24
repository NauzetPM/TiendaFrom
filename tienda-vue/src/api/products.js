import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

export const fetchProducts = async (filters = {}) => {
    try {
        const response = await axios.get(API_URL+'products/', { params: filters });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
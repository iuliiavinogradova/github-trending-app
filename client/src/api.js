import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Backend URL

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const getRepositories = async () => {
    try {
        console.log('Fetching repositories...');
        const response = await api.get('/repositories');
        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
};


export const getRepositoryById = async (id) => {
    try {
        const response = await api.get(`repository/${id}`);
        console.log('api Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};


export const startSync = async () => {
    try {
        const response = await api.post(`start-sync`);
        console.log(response.data.message);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
};

export const searchRepo = async (name) => {
    try {
        const response = await api.get(`repository/${name}`);
        console.log(response.data.message);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
};
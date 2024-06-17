import axios from 'axios';
const BASE_URL = 'http://localhost:5000/api';


export default axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': BASE_URL, 'accept': "*"}
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': BASE_URL, 'accept': "*"},
    withCredentials: true,
    timeout: 10000
});
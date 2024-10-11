import axios from "axios";
function sleep(ms: number){
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const API_URL = "https://api.github.com/users";

export const getUsername = async (name: string) =>{
    try {
        await sleep(1500)
        const response = await axios.get(`${API_URL}/${name}`);
        return response.data;
    } catch (error) {
        throw new Error('User not found.'); 
    }
}
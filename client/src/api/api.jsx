import axios from "axios";
// import 'dotenv/config'
console.log(import.meta.env.VITE_BASE_URL);

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

api.interceptors.response.use(
    response => response,
    async(error)=>{
        const originalReqeust = error.config;

        if(error?.response?.status === 401 && !originalReqeust._retry){
            originalReqeust._retry = true;
            try {
                await api.post("/users/refresh-token");
                return api(originalReqeust);
            } catch (error) {
                console.log("Token Refresh failed",error);
            }
        }

        return Promise.reject(error);
    }
)

export default api;
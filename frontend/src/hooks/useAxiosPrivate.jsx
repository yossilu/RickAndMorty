import { axiosPrivate } from "../api/axios";
import { useEffect, useMemo } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const {auth, isLoaded} = useAuth();
    const refresh = useRefreshToken();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            async config => {
                if (!config.headers['Authorization'] && isLoaded) {
                    config.headers['Authorization'] = `Bearer ${auth?.refreshToken ? auth?.refreshToken : user?.refreshToken}`;
                }
                return config;
            }, error => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                // if(error?.response?.status === 401 && !prevRequest?.sent){
                //     prevRequest.headers['Authorization'] = `Bearer ${auth?.refreshToken[0] ? auth?.refreshToken[0] : user?.refreshToken[0]}`;
                //     setTimeout(() => {
                //         return axiosPrivate(prevRequest); 
                //     }, 1000);
                    
                // }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [auth, refresh, isLoaded]);

    return axiosPrivate;
};

export default useAxiosPrivate;

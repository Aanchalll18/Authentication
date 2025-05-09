import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AppContent = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isloggedIn, setisLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    const getAuthState=async()=>{
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth', {
                withCredentials: true
            });
            
            if(data.success){
                setisLoggedIn(true)
                getUserData()
            }
        } catch (error) {
           toast.error(error.message) 
        }
    }

    const getUserData=async()=>{
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data', {
                withCredentials: true
            });
            
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(data.message)
        }
    }

    useEffect(()=>{
        getAuthState();
    },[])

    const value = {
        backendUrl,
        isloggedIn,
        setisLoggedIn,
        userData,
        setUserData,
        getUserData,
        getAuthState
    };

   
    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    );
};

export default AppContextProvider;

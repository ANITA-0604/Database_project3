import axios from 'axios';

export const login = async (username, password) => {
    try {
        const response = await axios.post('/auth/login', { username, password });
        const token = response.data.token;
        if (token) {
            localStorage.setItem('token', token);
        }
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response.data };
    }
};


export const register = async (username, password,fname, lname, email, role) => {
    try {
        const response = await axios.post('/auth/register', { username, password, fname, lname, email, role });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response.data };
    }
};

export const checkSession = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return { success: false, error: { message: 'No token found' } };
    }
    try {
        const response = await axios.get('/auth/session-info',{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return { success: true, data: response};
    }
    catch (error) {
        return { success: false, error: error.response.data }
    }
    
}

export const logout = async () => {
    try {
        localStorage.removeItem('token');
    }
    catch (error) {
        return {success:true, error: error.response.data}
    }
}
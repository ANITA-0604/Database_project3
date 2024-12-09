import axios from 'axios';

export const findOrder = async (orderID) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, error: { message: 'No token found' } };
        }
        const response = await axios.get('/orders/find', {
            params: { orderID },
            headers: {
                Authorization: `Bearer ${token}`
            }},
            );
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response ? error.response.data : { message: 'Network error' }
        };
    }
};
export const startOrder = async (clientUsername) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, error: { message: 'No token found' } };
        }
        const response = await axios.post("/orders/start", { clientUsername }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response)
        if (response.data.success) {
            const token = response.data.token;
            if(token)localStorage.setItem('token', response.data.token);
            console.log(localStorage.getItem('token'));

        }
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || "An unexpected error occurred." };
  }
};
export const categoriesOrder = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, error: { message: 'No token found' } };
        }
        const response = await axios.get('/orders/categories', {
            headers: {
                Authorization: `Bearer ${token}`
            }});
        return {
            success: response.success,
            data: response.data    
        }
    }
    catch (error) {
        return {
            success: false,
            data: error.response.message
        }
    }
}
export const getAvailableItems = async ( selectedCategory) => {
    try {
        console.log(selectedCategory)
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, error: { message: 'No token found' } };
        }
        const response = await axios.get('/orders/available-items', {
            params: {
                mainCategory: selectedCategory.mainCategory,
                subCategory: selectedCategory.subCategory
            },
            headers: {
                Authorization: `Bearer ${token}`
            }});
        return {
            success: response.success,
            data: response.data
        }
    }
    catch (error) {
         return {
            success: false,
            data: error.response.message
        }
    }
}

export const addItemsToOrders = async (cartItems) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, error: { message: 'No token found' } };
        }
        const response = await axios.post('/orders/add-item', { cartItems }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response);
        return {
            success: response.data.success,
            data: response.data
        };
    } catch (error) {
        // Handle backend error message
        console.error("Error response:", error.response);

        return {
            success: false,
            data: error.response?.data?.message || "An unknown error occurred"
        };
    }
};

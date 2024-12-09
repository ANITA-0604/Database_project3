import axios from 'axios';

export const acceptDonation = async (itemData, pieceData, donorData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, error: { message: 'No token found' } };
        }
        const response = await axios.post("/donations/accept", {
            itemData,
            pieceData,
            donorData,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        );
        return {
            success: true,
            data: response.data
        }
    }
    catch (error) {
        return {
            success: false,
            data: error.response.data
        }
    }
    
    
}
import axios from 'axios';

export const findItem = async (itemID) => {
    console.log(itemID);
    const response = await axios.get('/items/find', {
        params: { itemID } // Pass query parameters here
    });
    return response.data;
};

 
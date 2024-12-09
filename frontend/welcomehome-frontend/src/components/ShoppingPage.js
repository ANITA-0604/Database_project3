import React, { useEffect, useState } from 'react';
import { addItemsToOrders, categoriesOrder, getAvailableItems } from '../api/orders';

const ShoppingPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({});
    const [availableItems, setAvailableItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    // Fetch categories when the component loads
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoriesOrder(); // API request
                setCategories(response.data.categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);
    // Fetch available items when a category is selected
    useEffect(() => {
        const fetchItems = async (selectedCategory) => {
            try {
                const response = await getAvailableItems(selectedCategory); // API request
                setAvailableItems(response.data.items);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        if (selectedCategory.mainCategory && selectedCategory.subCategory) {
            console.log(selectedCategory)
            fetchItems(selectedCategory);
        }
    }, [selectedCategory]);

    // Handle category selection
    const handleCategorySelect = (event) => {
        const selectedValue = JSON.parse(event.target.value);
        setSelectedCategory(selectedValue);
    };

    // Handle adding an item to the cart
    const handleAddToCart = (item) => {
        setCartItems([...cartItems, item]); // Add item to cart
        setAvailableItems(availableItems.filter((i) => i.itemID !== item.itemID)); // Remove from available items
    };

    // Handle removing an item from the cart
    const handleRemoveFromCart = (item) => {
        setCartItems(cartItems.filter((i) => i.itemID !== item.itemID)); // Remove from cart
        setAvailableItems([...availableItems, item]); // Add back to available items
    };

    const handleAddItems = () => {
        const addItems = async () => {
            try {
                const response = await addItemsToOrders(cartItems); 
                if (response.success) {
                    alert("Successfully add items to the order!")
                    setCartItems([])
                }
                else {
                    console.log(response)
                    alert(response.data)
                }

            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        addItems();
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
            {/* Form Section (Left) */}
            <div style={{ width: '45%' }}>
                <h2>Shopping Form</h2>
                <div>
                    <h3>Select a Category</h3>
                    <select onChange={handleCategorySelect} style={{ width: '100%', padding: '8px' }}>
                        <option value="">-- Choose Category --</option>
                        {categories.map((category, index) => (
                            <option key={index} value={JSON.stringify(category)}>
                                {category.mainCategory} / {category.subCategory}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <h3>Available Items</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {availableItems.map((item) => (
                            <li key={item.itemID} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <strong>{item.iDescription}</strong> - {item.color}
                                </div>
                                <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Cart Section (Right) */}
            <div style={{ width: '45%' }}>
                <h2>Shopping Cart</h2>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {cartItems.map((item) => (
                        <li key={item.itemID} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <strong>{item.iDescription}</strong> - {item.color}
                            </div>
                            <button onClick={() => handleRemoveFromCart(item)}>Remove</button>
                        </li>
                    ))}
                </ul>
                <button onClick={()=>handleAddItems()}>Add to the current order</button>
            </div>
            
        </div>
    );
};

export default ShoppingPage;

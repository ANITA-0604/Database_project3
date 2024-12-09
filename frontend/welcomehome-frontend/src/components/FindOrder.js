import React, { useState } from 'react';

import { findOrder } from '../api/orders';

const OrderItems = ({ items }) => {
  if (!items || items.length === 0) {
    return <p>No items found for this order.</p>;
  }

  // Group pieces by itemID
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.itemID]) {
      acc[item.itemID] = [];
    }
    acc[item.itemID].push(item);
    return acc;
  }, {});
  console.log(groupedItems)
  return (
    <div>
      {Object.entries(groupedItems).map(([itemID, pieces]) => (
        <div
          key={itemID}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
          }}
        >
          <h3>Item ID: {itemID}</h3>
              <h4>Pieces:</h4>
              
            <ul>
                {pieces.map((piece) => (
                <li key={piece.pieceNum}>
                    <strong>Piece Number:</strong> {piece.pieceNum}, 
                    <strong> Room:</strong> {piece.roomNum}, 
                        <strong> Shelf:</strong> {piece.shelf},
                        <strong>Storage Notes:</strong> {piece.pNotes}
                </li>
                ))}
            </ul>
        </div>
      ))}
    </div>
  );
};
function FindOrder() {
    const [orderID, setOrderID] = useState('');
    const [orderDetails, setOrderDetails] = useState(null);
    const [error, setError] = useState('');
    console.log(orderDetails)
    const handleFindOrder = async () => {
        setError('');
        setOrderDetails(null);

        if (!orderID) {
            setError('Order ID is required');
            return;
        }

        const response = await findOrder(orderID);

        if (response) {
            setOrderDetails(response.data);
        } else {
            setError(response.error.message);
        }
    };

    return (
        <div>
            <h1>Find Order</h1>
            <input
                type="text"
                placeholder="Order ID"
                value={orderID}
                onChange={(e) => setOrderID(e.target.value)}
            />
            <button onClick={handleFindOrder}>Find</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            
            {orderDetails && <OrderItems items={orderDetails.items} />}

        </div>
    );
}

export default FindOrder;

import React, { useState } from 'react';

import { findItem } from '../api/items';

const ItemPieces = ({ pieces }) => {
  if (!pieces || pieces.length === 0) {
    return <p>No pieces found.</p>;
  }

  return (
    <div>
      {pieces.map((piece, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
          }}
        >
          <h4>Piece Number: {piece.pieceNum}</h4>
          <p>
            <strong>Room Number:</strong> {piece.roomNum}
          </p>
          <p>
            <strong>Shelf:</strong> {piece.shelf}
          </p>
          <p>
            <strong>Piece Notes:</strong> {piece.notes}
          </p>
        </div>
      ))}
    </div>
  );
};

function FindItem() {
    const [itemID, setItemID] = useState('');
    const [pieces, setPieces] = useState([]);

    const handleFindItem = async () => {
        const response = await findItem(itemID);
        setPieces(response.pieces);
    };

    return (
        <div>
            <h1>Find Item</h1>
            <input
                type="text"
                placeholder="Item ID"
                value={itemID}
                onChange={(e) => setItemID(e.target.value)}
            />
            <button onClick={handleFindItem}>Find</button>
            <ItemPieces pieces={pieces } />
        </div>
    );
}

export default FindItem;

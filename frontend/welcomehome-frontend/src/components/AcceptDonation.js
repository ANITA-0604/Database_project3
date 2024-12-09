import React, { useState } from 'react';

import { acceptDonation } from '../api/donations';
import axios from 'axios';

const AcceptDonationForm = () => {
  const [itemData, setItemData] = useState({
    iDescription: "",
    photo: "",
    color: "",
    isNew: false,
    hasPieces: false,
    material: "",
    mainCategory: "",
    subCategory: "",
  });

  const [pieceData, setPieceData] = useState([]);
  const [donorData, setDonorData] = useState("");

  const handleItemChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItemData({ ...itemData, [name]: type === "checkbox" ? checked : value });
  };

  const handleDonorChange = (e) => {
    setDonorData(e.target.value);
  };

  const addPiece = () => {
    setPieceData([
      ...pieceData,
      {
        pDescription: "",
        length: 0,
        width: 0,
        height: 0,
        location: { roomNum: "", shelfNum: "" }, // Include location for each piece
      },
    ]);
  };

  const handlePieceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPieces = pieceData.map((piece, i) =>
      i === index
        ? { ...piece, [name]: value }
        : piece
    );
    setPieceData(updatedPieces);
  };

  const handlePieceLocationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPieces = pieceData.map((piece, i) =>
      i === index
        ? { ...piece, location: { ...piece.location, [name]: value } }
        : piece
    );
    setPieceData(updatedPieces);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await acceptDonation(
        itemData,
        pieceData,
          donorData);
        console.log(response)
        if (response.success) {
            alert("Item donated successfully!");
        }
        else {
            alert(response.data.message);
        }
      
    } catch (error) {
      console.error(error);
      alert("Error while donating item.");
    }
  };
    const removePiece = (index) => {
    setPieceData(pieceData.filter((_, i) => i !== index));
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Donate Item</h2>

      <h3>Item Details</h3>
      <input type="text" name="iDescription" placeholder="Description" onChange={handleItemChange} />
      <input type="text" name="photo" placeholder="Photo URL" onChange={handleItemChange} />
      <input type="text" name="color" placeholder="Color" onChange={handleItemChange} />
      <input type="checkbox" name="isNew" onChange={handleItemChange} /> New Item
      <input type="checkbox" name="hasPieces" onChange={handleItemChange} /> Has Pieces
      <input type="text" name="material" placeholder="Material" onChange={handleItemChange} />
      <input type="text" name="mainCategory" placeholder="Main Category" onChange={handleItemChange} />
      <input type="text" name="subCategory" placeholder="Sub Category" onChange={handleItemChange} />

      <h3>Donor Details</h3>
      <input type="text" name="userName" placeholder="Username" onChange={handleDonorChange} />

      <h3>Pieces</h3>
      {pieceData.map((piece, index) => (
        <div key={index}>
          <h4>Piece {index + 1}</h4>
          <input
            type="text"
            name="pDescription"
            placeholder="Description"
            onChange={(e) => handlePieceChange(index, e)}
          />
          <input
            type="number"
            name="length"
            placeholder="Length"
            onChange={(e) => handlePieceChange(index, e)}
          />
          <input
            type="number"
            name="width"
            placeholder="Width"
            onChange={(e) => handlePieceChange(index, e)}
          />
          <input
            type="number"
            name="height"
            placeholder="Height"
            onChange={(e) => handlePieceChange(index, e)}
          />
          <h5>Location</h5>
          <input
            type="text"
            name="roomNum"
            placeholder="Room Number"
            onChange={(e) => handlePieceLocationChange(index, e)}
          />
          <input
            type="text"
            name="shelfNum"
            placeholder="Shelf Number"
            onChange={(e) => handlePieceLocationChange(index, e)}
              />
              <button type="button" onClick={() => removePiece(index)}>Remove Piece</button>
        </div>
      ))}
      <button type="button" onClick={addPiece}>Add Piece</button>

      <button type="submit">Submit</button>
    </form>
  );
};
 
export default AcceptDonationForm;

// src/components/StartOrder.js
import React, { useState } from "react";

import { startOrder } from "../api/orders";

const StartOrder = () => {
  const [clientUsername, setClientUsername] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleStartOrder = async () => {
    const data = await startOrder(clientUsername);
    if (data.error) {
      setResponseMessage(`Error: ${data.error}`);
    } else {
      setResponseMessage(`Order started successfully! Order ID: ${data.orderID}`);
    }
  };

  return (
    <div>
      <h2>Start an Order</h2>
      <input
        type="text"
        value={clientUsername}
        onChange={(e) => setClientUsername(e.target.value)}
        placeholder="Enter client username"
      />
      <button onClick={handleStartOrder}>Start Order</button>
      <p>{responseMessage}</p>
    </div>
  );
};

export default StartOrder;

import React, { useState } from 'react';

const PaymentModal = ({ show, onClose, onPay }) => {
  const [amount, setAmount] = useState('');

  if (!show) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onPay(amount);
  };

  return (
    <div className="payment-modal">
      <div className="payment-modal-content">
        <h2>Payment</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Enter amount" 
          />
          <button type="submit">Pay</button>
          <button onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;

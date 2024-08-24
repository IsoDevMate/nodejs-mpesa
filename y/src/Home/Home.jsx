import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #100F0F;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #49DF5B;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
`;

const Checkout = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState(0);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cartData = JSON.parse(urlParams.get('cart'));
    console.log(cartData)

    let totalAmount = 0;
  cartData.forEach((item) => {
    totalAmount += item.price * item.quantity;
  });
    setAmount(totalAmount);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Phone Number:', phoneNumber);
    console.log('Amount:', amount);

    try {
      const payload = {
        amount: amount,
        phone: phoneNumber,
      };

      const url = 'https://nodejs-mpesa.onrender.com/api/stk';
      const response = await axios.post(url, payload);
      console.log(response.data);

      // Handle the response from the backend as needed
      if (response.status === 200) {
        // Success
        console.log('STK Push initiated successfully');
      } else {
        // Error
        console.error('Error initiating STK Push');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
    <Container>
      <Title>MPESA STK Push</Title>
      <form onSubmit={handleSubmit}>
        <InputContainer>
          <Input
            type="text"
            placeholder="Enter Phone Number e.g. 0745********"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <Input
            type="text"
            placeholder={`Total Amount: $${amount}`}
            value={amount}
            readOnly
          />
        </InputContainer>
        <Button type="submit">Pay Now</Button>
      </form>
    </Container>
    <div className="container mx-auto px-4">
    </div>
    
    </>
  );
};

export default Checkout;

/*import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #800080;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
`;

const Home = () => {
    const [number, setNumber] = useState('');
    const [amount, setAmount] = useState('');
  
    const handleChange = (e) => {
        const inputValue = e.target.value;
        const parsedAmount = parseInt(inputValue);
        setAmount(parsedAmount);
      };

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('Number:', number);
      console.log('Amount:', amount);
  
   
      try {
        const payload = {
          amount: amount,
          phone: number, 
        };
  
        const url = 'http://localhost:5050/api/stk';
        const response = await axios.post(url, payload);
        console.log(response.data);
  
        // Handle the response from the backend as needed
        if (response.status === 200) {
          // Success
          console.log('STK Push initiated successfully');
        } else {
          // Error
          console.error('Error initiating STK Push');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  return (
    <Container>
      <Title>MPESA STK Push</Title>
      <form onSubmit={handleSubmit}>
        <InputContainer>
          <Input
            type="text"
            placeholder="Enter Number i.e 0745********"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          
        </InputContainer>
        <InputContainer>
          <Input
            type="text"
            placeholder="Enter Amount i.e 50"
            value={amount}
            onChange={handleChange}
          />
        </InputContainer>
        <Button type="submit">Button</Button>
      </form>
    </Container>
  );
};

export default Home;
*/
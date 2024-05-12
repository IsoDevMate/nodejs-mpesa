
import { useState } from 'react';
import styled from 'styled-components';

const ProductList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Product = styled.li`
  margin-bottom: 1rem;
`;

const Products = () => {
  const [cart, setCart] = useState([]);

  const products = [
    { id: 1, name: 'client_secret', price: 5},
    { id: 2, name: 'Apikey', price: 2 },
   
  ];

  const handleAddToCart = (product, quantity) => {
    setCart((prevCart) => [...prevCart, { ...product, quantity }]);
  };

  return (
    <div>
      <h2>Products</h2>
      <ProductList>
        {products.map((product) => (
          <Product key={product.id}>
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <input
              type="number"
              min="1"
              defaultValue="1"
              onChange={(e) => handleAddToCart(product, parseInt(e.target.value))}
            />
          </Product>
        ))}
      </ProductList>
      <CheckoutButton cart={cart} />
    </div>
  );
};

const CheckoutButtons = styled.button`
  background-color: #73EA8B;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
`;



const CheckoutButton = ({ cart }) => {
  const handleCheckout = () => {
    window.location.href = `/checkout?cart=${JSON.stringify(cart)}`;
  };

  return <CheckoutButtons onClick={handleCheckout}>Checkout</CheckoutButtons>;
};

export default Products;S
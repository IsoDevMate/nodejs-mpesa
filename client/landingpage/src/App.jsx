

import { useState, useEffect } from "react";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const App = () => {
  const [amount, setAmount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const debouncedPhoneNumber = useDebounce(phoneNumber, 500);

  const handleChange = (e) => {
    setIsLoading(true);
    setPhoneNumber(e.target.value);
    setAmount(e.target.value);
  };

  useEffect(() => {
    if (debouncedPhoneNumber.startsWith("2547") || debouncedPhoneNumber === "") {
      setIsLoading(false);
      setIsValid(true);
    } else {
      setIsLoading(false);
      setIsValid(false);
    }
  }, [debouncedPhoneNumber]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`You have successfully paid $${amount} to ${debouncedPhoneNumber}`);
  };

  return (
    <>
      <div className="phone-container">
        <input
          onChange={handleChange}
          className="control"
          placeholder="Type your PhoneNumber"
        />
        <div className={`spinner ${isLoading ? 'loading' : ''}`}></div>
        <div className={`validation ${!isValid ? 'invalid' : ''}`}></div>

        <input
          onChange={handleChange}
          className="control"
          placeholder="Enter Amount to send"
        />
        <div className={`spinner ${isLoading ? 'loading' : ''}`}></div>
        <div className={`validation ${!isValid ? 'invalid' : ''}`}></div>
      </div>
      <button onClick={handleSubmit} type="submit">
        Pay ${amount}
      </button>
    </>
  );
};

export default App;

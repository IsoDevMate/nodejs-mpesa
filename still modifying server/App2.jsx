import React from "react";
import './App.css';
import { useState,useEffect } from "react";
// custom hook 
// technique used to delay the execution of a function or update of a value 
// until a certain period of inactivity has passed
const useDebounce=(value,delay)=>{
  const [debounceValue,setDebounceValue]=useState(value);
  useEffect(()=>{
    const handler=setTimeout(()=>{
      setDebounceValue(value);
    },delay);
    return ()=>{
      clearTimeout(handler);
    };
  },[value,delay]);
  return debounceValue;
}

export const App=()=>{
  const [amount, setAmount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);


  const debouncedPhoneNumber = useDebounce(value,500)
const handleChange = e =>{
  setIsLoading(true);
  setPhoneNumber(e.target.value);
  setAmount(e.target.value);

}
useEffect(()=>{
  //set useEffect logic if phone number fomat does not start with 2547 alert message(not correct format)
  if(debouncedPhoneNumber.startsWith("2547") || ){
    setIsLoading(false);
    setIsValid(true);
  }else{
    setIsLoading(false);
    setIsValid(false);
  }
},[debouncedPhoneNumber]);
const handleSubmit = e =>{
  e.preventDefault();
  alert(`You have successfully paid ${amount} to ${phoneNumber}`);
}
 const Amount=({isLoading,isValid,handleChange})=>{
 const PhoneNumber=({isLoading,isValid,handleChange})=>{
return(
 <PhoneNumber
        isLoading={isLoading}
        isValid={isValid}
        handleChange={handleChange}
        />
)}
 

//  code uses template literals with string interpolation ${} for dynamic behaviour.

  <>  
  <div className="phone-container">
<input
onChange={handleChange}
className="control"
placeholder="Type your PhoneNumber "
/>
<div className={
  `spinner ${isLoading ? 'loading' : ''}`
  }></div>
<div className={
  `validation ${!isValid ? 'invalid':''}`
}></div>

<input
onChange={handleChange}
className="control"
placeholder="enter Amount to send"
/>
<div className={
  `spinner ${isLoading ? 'loading' : ''}`
  }></div>
<div className={
  `validation ${!isValid ? 'invalid':''}`
}></div>
</div>
  <button onClick={handleSubmit} type="submit">Pay ${amount}</button>
  </>
}
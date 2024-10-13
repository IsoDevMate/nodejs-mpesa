import  { useState, useEffect } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, MenuItem, FormControl, Select } from '@mui/material';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

//define an object for selecting the dates 
const dateOptions = [
  { value: '01 JAN, 2024 - 01 APRIL, 2024', label: 'January 2024 - April 2024' },
  { value: '01 APRIL, 2024 - 01 JULY, 2024', label: 'April 2024 - July 2024' },
  { value: '01 JULY, 2023 - 01 OCTOBER, 2024', label: 'July 2023 - October 2024' },
  { value: '01 OCTOBER, 2023 - 01 JAN, 2024', label: 'October 2023 - January 2024' },
];
const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedDateOption, setSelectedDateOption] = useState(dateOptions[0].value);

  const handleDateChange = (event) => {
    setSelectedDateOption(event.target.value);
  };
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('https://nodejs-mpesa.onrender.com/api/allTransactions');
        console.log(response.data)
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions(); 
  }, []);

 
  const groupTransactionsByMonth = (transactions) => {
    const groupedTransactions = {};

    transactions.forEach((transaction) => {
      const month = new Date(transaction.TransactionDate).toLocaleString('default', { month: 'long' });
      const year = new Date(transaction.TransactionDate).getFullYear();

      if (!groupedTransactions[`${month} ${year}`]) {
        groupedTransactions[`${month} ${year}`] = [];
      }

      groupedTransactions[`${month} ${year}`].push(transaction);
    });

    return groupedTransactions;
  };

  const groupedTransactions = groupTransactionsByMonth(transactions);

  return (
    <Box className="min-h-screen bg-cream flex flex-col items-center py-8">
      <Box className="bg-white p-4 rounded-lg shadow-md w-full max-w-3xl">
      <Typography variant="h6" className="text-gray-800 font-bold mb-4">
        History Transactions
      </Typography>
      <Typography variant="body2" className="text-gray-600 mb-2">
        Track and monitor your financial activity.
      </Typography>
      <Box className="bg-white rounded-lg p-2 mb-4">
          <FormControl fullWidth>
            <Select
              value={selectedDateOption}
              onChange={handleDateChange}
            >
              {dateOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Typography variant="body2" className="text-gray-600 mb-2">
          Selected Period: {dateOptions.find((option) => option.value === selectedDateOption)?.label}
        </Typography>
      {Object.keys(groupedTransactions).map((month) => (
        <Accordion key={month} className="bg-white rounded-lg mb-2 shadow-sm">
          <AccordionSummary
           expandIcon={<ChevronDownIcon className="h-5 w-5 text-gray-500" />} 
            aria-controls={`panel-${month}-content`}
            id={`panel-${month}-header`}
          >
            <Typography variant="body1" className="text-gray-800">
              {month}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {groupedTransactions[month].map((transaction) => (
              <Box key={transaction._id} className="flex justify-between items-center mb-2">
                <Typography variant="body2" className="text-gray-600">
                  {transaction.MpesaReceiptNumber}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {transaction.PhoneNumber}
                </Typography>
                <Typography
                  variant="body2"
                  className={`font-bold ${transaction.Amount < 0 ? 'text-red-500' : 'text-green-500'}`}
                >
                  {transaction.Amount}
                </Typography>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
    </Box>
  );
};

export default TransactionHistory;
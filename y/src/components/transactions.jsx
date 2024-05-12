import  { useState, useEffect } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedDate, setSelectedDate] = useState('01 JAN, 2023 - 01 JAN, 2024');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/allTransactions');
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
        <Typography variant="body2" className="text-gray-600">
          {selectedDate}
        </Typography>
      </Box>
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
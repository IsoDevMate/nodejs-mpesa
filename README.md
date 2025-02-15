# NodeJS M-Pesa Integration

This project demonstrates integration with Safaricom's Daraja API for M-Pesa payment services, specifically focused on STK Push and QR code generation using the Daraja sandbox environment.

## Features

- M-Pesa STK Push initiation
- QR Code generation for payments
- Firebase Cloud Messaging for push notifications
- Token storage and management
- Transaction logging and retrieval
- Callback URL handling
- Docker containerization
- Load tested and optimized for high traffic

## Prerequisites

- Node.js (v20 recommended)
- MongoDB
- Safaricom Daraja API credentials (consumer key, consumer secret, passkey)
- Firebase Admin SDK setup for push notifications

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5050
MPESA_PAYBILL=your_paybill_number
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
DATABASE_URI=your_mongodb_connection_string
CALLBACK_URL=your_callback_url
```

## Installation and Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Place your Firebase Admin SDK JSON file in the root directory
4. Start the application:
   ```
   npm start
   ```

## Docker Deployment

A Dockerfile is included for containerization:

```
docker build -t mpesa-node-app .
docker run -p 5050:5050 --env-file .env mpesa-node-app
```

## API Endpoints

### STK Push
```
POST /api/stk
Body: {
  "amount": "1",
  "phone": "254XXXXXXXXX"
}
```

### Generate QR Code
```
POST /api/generateqr
Body: {
  "amount": 100,
  "AccountReference": "REF123"
}
```

### Save FCM Token
```
POST /save-token
Body: {
  "token": "firebase_token",
  "userId": "user_id"
}
```

### Send Push Notification
```
POST /send-notification
Body: {
  "title": "Notification Title",
  "body": "Notification Body",
  "userId": "user_id"
}
```

### Other Endpoints
- `POST /api/myCallBack` - Callback URL for M-Pesa
- `GET /api/allTransactions` - Fetch all transactions
- `GET /api/oneTransaction/:id` - Fetch specific transaction
- `POST /api/stkpushquery` - Query STK push status
- `POST /api/register` - Register URLs with M-Pesa
- `POST /api/c2b/v1/confirm` - C2B confirmation URL
- `POST /api/c2b/v1/validate` - C2B validation URL

## Load Testing

The project includes K6 scripts for load testing different scenarios:
- Basic STK push test
- Combined STK push and query test with various load stages

To run the tests:
```
k6 run tests/load-test.js
```

### Performance Notes

The application has been spike and stress tested with excellent results under normal conditions. However, under extremely high load, the Daraja API may return 429 (Too Many Requests) errors. Key observations:

- The application performs well under moderately high load
- At peak stress levels, some requests may fail with 429 errors
- No performance degradation was observed in the application itself
- Database connections remained stable during high-load periods

### Rate Limiting Considerations

To handle rate limiting (429 errors):

1. Implement exponential backoff and retry logic
2. Add request queuing for high-traffic periods
3. Consider implementing a circuit breaker pattern
4. Monitor API usage to stay within Safaricom's limits
5. Add logging for failed requests to track patterns

## Note on Push Notifications

The code includes a Firebase Cloud Messaging integration for sending push notifications to users. Tokens are stored in MongoDB and associated with user IDs.

## Error Handling

The API includes proper error handling for:
- Failed token generation
- Invalid tokens (auto-deletion from database)
- Failed notifications
- Invalid M-Pesa responses
- Rate limiting (429) errors

## Security Considerations

- Store sensitive credentials in environment variables
- Use HTTPS in production
- Validate all input data
- Handle errors gracefully without exposing sensitive information
- Implement proper rate limiting to prevent abuse

## License

This project is intended for learning purposes. Please check Safaricom's terms of service before using in production.

# MPESA Payment Gateway Integration

[![License]](LICENSE)

> A Node.js project for integrating the MPESA payment gateway.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Description

This project provides a Node.js application for integrating the MPESA payment gateway into your application. It allows you to generate an access token, initiate an STK push, and query the status of an STK push transaction.

## Features

- Generate access token for MPESA API authentication
- Initiate STK push payment
- Query the status of an STK push transaction

## Installation

1. Clone the repository:

   ```bash
Clone the repository
   $ git clone https://github.com/IsoDevMate/nodejs-mpesa.git

 Navigate to the project directory: 
   $ cd nodejs-mpesa

Install the dependencies
   $ npm install

Set up environment variables:

Create a .env file in the root of the project.
Define the required environment variables in the .env file.

MPESA_SECRET_KEY=your-secret-key
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_PAYBILL=your-paybill-number
MPESA_PASSKEY=your-passkey
PORT=5003 
//use your prefferd port

Start the server:
  $ npm start

This will start the server on the specified port (default is 5003). You should see the following message in the console:

       Server listening on 5003

USAGE

   You can access the server's endpoints using the following URLs:

Token endpoint: http://localhost:3000/initiate-stk-push
STK endpoint: http://localhost:3000/sacces-token
Make sure to modify the URLs accordingly if you're running the server on a different host or port.

DEVELOPMENT


During development, you can use the following command to start the server with automatic restarts on file changes:

$npm run dev

  
TO RUN THE MARP.MD  CMD/CTRL + SHIFT + P to open command palette
   =>open preview slide

Ensure to obtain your own calback url from https://dashboard.ngrok.com/get-started/setup

use it within your post request body or in your payload

## App is still under maintainance and code reviewing
 
#BuildWithAT #WeLoveNerds
//spiketest

var http = require('k6/http');
var sleep = require('k6').sleep;
var check = require('k6').check;
const API_BASE_URL = 'http://localhost:5050/api';
module.exports.options = {
    InsecureSkipTLSVerify: true,
    noConnectionReuse: false,
  stages: [
    { duration: '10s', target: 100 }, 
    { duration: '1m', target: 100 },
    { duration: '10s', target: 1400 },
    { duration: '1m', target: 1400 },
    { duration: '10s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '10s', target: 400 }
  ],
};

module.exports.default = function() {
    const responses = http.batch([
      ['POST', `${API_BASE_URL}/stk`, {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "amount": "1",
          "phone": "0769784198"
        }),
      }]
    ]);
  
    // Check the status code for the first request
    check(responses[0], {
      "status is 200": (r) => r.status === 200,
      "response body": (r) => r.body.includes("success_message"),
    });
  
    // Check the status code for the second request
  
  
    sleep(1);
  };

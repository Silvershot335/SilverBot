const fetch = require('node-fetch');

const tokenURL = 'https://opentdb.com/api_token.php?command=request';
const requestURL = 'https://opentdb.com/api.php?amount=10&token=';

async function main() {
  const token = await getToken();
  console.log(token);
}

async function getToken() {
  // response_code
  // response_message
  // token
  return await fetch(tokenURL)
    .then(res => res.json())
    .then(response => response.token);
} 
 
main();
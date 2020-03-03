# How to get ENV files to work

0. Run npm install
1. Create a new file in the root of your directory (next to .gitignore) called .env
2. Open up sample.env
3. Copy all contents of the sample.env file into .env
4. Change the placeholder values in the .env file to the actual values


Any variables in the .env file are loaded upon start and placed in the variable process.env

They can be used like so:

`console.log(process.env.MY_VARIABLE);`

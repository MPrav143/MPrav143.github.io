const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
    console.log('Error loading .env:', result.error);
} else {
    console.log('.env loaded successfully');
}

const user = process.env.ADMIN_USERNAME;
const pass = process.env.ADMIN_PASSWORD;

console.log(`ADMIN_USERNAME: '${user}'`);
console.log(`ADMIN_PASSWORD: '${pass}'`);
console.log(`Username Length: ${user ? user.length : 'N/A'}`);
console.log(`Password Length: ${pass ? pass.length : 'N/A'}`);

const expectedUser = 'Tony Stark';
const expectedPass = 'Stark@0143';

console.log(`Match User: ${user === expectedUser}`);
console.log(`Match Pass: ${pass === expectedPass}`);

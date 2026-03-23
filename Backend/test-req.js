const axios = require('axios');
axios.post('https://portfoliobackend-hnac.onrender.com/api/contact', {
    name: 'test',
    email: 'test@example.com',
    message: 'test'
}).then(res => console.log(res.data))
  .catch(err => console.error(err.response ? err.response.data : err.message));

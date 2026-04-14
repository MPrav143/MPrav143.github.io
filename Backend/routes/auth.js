const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    // Simple check against env variables (Single Admin User)
    const { username, password } = req.body;

    console.log('Login Attempt:', { username, password });

    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
        console.log('Login Failed: Credentials mismatch');
        return res.status(400).send('Invalid Credentials');
    }

    // Create and assign a token
    const token = jwt.sign({ _id: 'admin' }, process.env.JWT_SECRET);
    res.header('auth-token', token).send({ token });
});

module.exports = router;

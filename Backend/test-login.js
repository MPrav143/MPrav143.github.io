const testLogin = async (username, password) => {
    try {
        console.log(`Attempting login with: '${username}', '${password}'`);
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Success! Token:', data.token ? 'Received' : 'Missing');
        } else {
            console.log('Failed:', res.status, await res.text());
        }
    } catch (err) {
        console.log('Error:', err.message);
    }
};

(async () => {
    // 1. Expected correct credentials
    await testLogin('Tony Stark', 'Stark@0143');

    // 2. Wrong username
    await testLogin('Tony', 'Stark@0143');

    // 3. Wrong password
    await testLogin('Tony Stark', 'wrongpass');
})();

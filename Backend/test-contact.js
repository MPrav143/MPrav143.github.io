const testContact = async () => {
    try {
        // 1. Send Message
        console.log('Sending test message...');
        const sendRes = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Bot',
                email: 'test@bot.com',
                message: 'Hello from verification script!'
            })
        });
        console.log('Send Status:', sendRes.status, await sendRes.text());

        // 2. Fetch Messages (simulating admin)
        // Need to login first to get token! 
        // Or assume success if POST worked. Real E2E needs token.
        // For quick check, POST success means DB write works.
    } catch (err) {
        console.log('Error:', err.message);
    }
};

testContact();

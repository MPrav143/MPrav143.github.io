// Native fetch is available in Node 18+

const testEndpoints = async () => {
    const endpoints = ['education', 'skills', 'projects'];

    for (const ep of endpoints) {
        try {
            console.log(`Testing /api/${ep}...`);
            const res = await fetch(`http://localhost:5000/api/${ep}`);
            if (res.ok) {
                const data = await res.json();
                console.log(`SUCCESS /api/${ep}: Found ${Array.isArray(data) ? data.length : 'invalid'} items.`);
                console.log(JSON.stringify(data, null, 2).substring(0, 200) + '...');
            } else {
                const text = await res.text();
                console.log(`FAILED /api/${ep}: ${res.status}`, text);
            }
        } catch (err) {
            console.log(`ERROR /api/${ep}: ${err.message}`);
        }
        console.log('---');
    }
};

testEndpoints();

const testEducation = async () => {
    try {
        const payload = {
            institution: "Test School",
            degree: "High School",
            duration: "2020-2022",
            gpa: "90%",
            courses: ["Math", "Science"]
        };

        console.log("Sending payload:", JSON.stringify(payload));
        const res = await fetch('http://localhost:5000/api/education', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Error Status:", res.status);
            console.error("Error Body:", text);
        } else {
            const data = await res.json();
            console.log("Success:", data);
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
};

testEducation();

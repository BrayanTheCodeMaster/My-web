document.getElementById('signup-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Collect form data
    const formData = {
        first_name: document.querySelector('input[name="first_name"]').value,
        last_name: document.querySelector('input[name="last_name"]').value,
        username: document.querySelector('input[name="username"]').value,
        email: document.querySelector('input[name="email"]').value,
        password: document.querySelector('input[name="password"]').value,
        confirm_password: document.querySelector('input[name="confirm_password"]').value,
    };

    // Ensure passwords match
    if (formData.password !== formData.confirm_password) {
        alert("Passwords do not match!");
        return;
    }

    // Send the data to the server
    try {
        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            // Redirect or show confirmation prompt here
        } else {
            alert(result.message || 'An error occurred.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Unable to sign up. Please try again later.');
    }
});

document.getElementById('signup-form').addEventListener('submit', async function (e) {
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
        alert('Passwords do not match!');
        return;
    }

    // Send the data to the server
    try {
        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        // Check if response is OK
        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message || 'An error occurred during sign up.');
            return;
        }

        const result = await response.json();
        alert(result.message);
        window.location.href = '/login'; // Redirect to login page
    } catch (error) {
        console.error('Error:', error);
        alert('Unable to sign up. Please check the server connection.');
    }
});

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form submission

    // Get form values
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Frontend validation
    if (!username || !email || !password || !confirmPassword) {
        alert('All fields are required.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    try {
        // Fetch the signed CSRF token from the server
        const csrfTokenResponse = await fetch('/csrf-token', {
            method: 'GET',
            credentials: 'include', // Ensures cookies are sent with the request
        });
        if (!csrfTokenResponse.ok) {
            throw new Error('Failed to fetch CSRF token.');
        }

        const csrfTokenData = await csrfTokenResponse.json();
        const csrfToken = csrfTokenData.csrfToken; // Retrieve the signed CSRF token

        // Send data to the backend with the CSRF token
        const response = await fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': csrfToken, // Include signed CSRF token in the headers
            },
            body: JSON.stringify({ username, email, password, confirmPassword }),
        });

        if (response.ok) {
            alert('Signup successful! Please log in.');
            window.location.href = '/login';
        } else {
            const errorData = await response.json();
            alert('Signup failed: ' + (errorData.message || 'An unexpected error occurred.'));
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred. Please try again.');
    }
});
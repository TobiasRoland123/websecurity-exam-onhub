 document.getElementById('signupForm').addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent form submission

            // Get form values
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
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
                // Send data to the backend
                const response = await fetch('/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password, confirmPassword })
                });

                if (response.ok) {
                    alert('Signup successful! Please log in.');
                    window.location.href = '/login'; 
                } else {
                    const errorData = await response.json();
                    alert('Signup failed: ' + errorData.message);
                }
            } catch (error) {
                console.error('Error during signup:', error);
                alert('An error occurred. Please try again.');
            }
        });
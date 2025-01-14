document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevents the page from reloading

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }

            try {
                const response = await fetch("/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error("Invalid email or password.");
                    } else {
                        throw new Error("An error occurred. Please try again.");
                    }
                }

    const data = await response.json();
    const { token, role } = data;

    console.log('Login successful:', role, token);

    // Redirect based on user role
    if (role === 'admin') {
      window.location.href = '/dashboard';
    } else if (role === 'customer') {
      window.location.href = '/profile';
    } else {
      throw new Error('Unknown user role.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed: ' + error.message);
  }
});

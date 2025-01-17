document.addEventListener('DOMContentLoaded', () => {
  // Select all elements with the logout-button ID
  const logoutButtons = document.querySelectorAll('#logoutButton');

  // Attach event listener to each button
  logoutButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        // Fetch the signed CSRF token
        const csrfTokenResponse = await fetch('/csrf-token', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });

        if (!csrfTokenResponse.ok) {
          throw new Error('Failed to fetch CSRF token.');
        }

        const csrfTokenData = await csrfTokenResponse.json();
        const csrfToken = csrfTokenData.csrfToken;

        // Send the logout request with the CSRF token
        const response = await fetch('/auth/logout', {
          method: 'POST',
          credentials: 'include', // Include cookies in the request
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken, // Include the CSRF token in the headers
          },
        });

        if (response.ok) {
          // Redirect to the login page on successful logout
          window.location.href = '/login';
        } else {
          alert('Logout failed');
        }
      } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred while logging out.');
      }
    });
  });
});
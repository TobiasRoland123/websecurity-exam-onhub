document.addEventListener('DOMContentLoaded', () => {
  // Select all elements with the logout-button class
  const logoutButtons = document.querySelectorAll('#logoutButton');

  // Attach event listener to each button
  logoutButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        const response = await fetch('/auth/logout', {
          method: 'POST',
          credentials: 'include', // Ensures cookies are included in the request
        });

        if (response.ok) {
          window.location.href = '/login'; // Redirect to the login page
        } else {
          alert('Logout failed');
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    });
  });
});
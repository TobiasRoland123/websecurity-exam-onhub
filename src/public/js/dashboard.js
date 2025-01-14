document.addEventListener('DOMContentLoaded', () => {
    const usersListContainer = document.getElementById('users-list');
    const adminUsernameElement = document.getElementById('admin-username');
    const adminEmailElement = document.getElementById('admin-email');
    const adminRoleElement = document.getElementById('admin-role');

    let currentAdminId = null; // Store the admin's ID for validation

    // Fetch admin's information
    async function fetchAdminData() {
        try {
            const response = await fetch('/auth/me', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                adminUsernameElement.textContent = data.user.username;
                adminEmailElement.textContent = data.user.email;
                adminRoleElement.textContent = data.user.role.charAt(0).toUpperCase() + data.user.role.slice(1);
                currentAdminId = data.user.id; // Store the admin's ID
            } else {
                console.warn('User not logged in or unauthorized.');
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
    }

    // Fetch all users from the database
    async function fetchAllUsers() {
        try {
            const response = await fetch('/users', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to fetch users');

            const users = await response.json();
            usersListContainer.innerHTML = '';

            if (users.length === 0) {
                usersListContainer.innerHTML = '<p>No users found.</p>';
                return;
            }

            users.forEach(user => {
                const userElement = document.createElement('li');
                userElement.classList.add('bg-gray-100', 'p-4', 'rounded-md', 'shadow-sm');
                userElement.innerHTML = `
                    <p><strong>Username:</strong> ${user.username}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Role:</strong> ${user.role}</p>
                    ${
                        user.role.toLowerCase() === 'admin' || user.id === currentAdminId
                            ? '<p class="text-blue-500">Admin - Cannot be deleted</p>'
                            : `
                            <button 
                                class="delete-user-btn bg-red-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-red-600"
                                data-user-id="${user.id}">
                                Delete User
                            </button>
                          `
                    }
                `;
                usersListContainer.appendChild(userElement);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            usersListContainer.innerHTML = '<p class="text-red-500">Error loading users.</p>';
        }
    }


    // Delete user functionality
    usersListContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-user-btn')) {
            const userId = e.target.getAttribute('data-user-id');

            // Prevent deletion of admin or current logged-in admin
            if (userId == currentAdminId) {
                alert('You cannot delete yourself as an admin.');
                return;
            }

            if (confirm('Are you sure you want to delete this user?')) {
                try {
                    const response = await fetch(`/users/${userId}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    if (response.ok) {
                        alert('User deleted successfully!');
                        fetchAllUsers();
                    } else {
                        const error = await response.json();
                        alert(`Error: ${error.message}`);
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            }
        }
    });

    // Call both functions on page load
    fetchAdminData();
    fetchAllUsers();
});
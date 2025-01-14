document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const messageElement = document.getElementById('message');
  const usernameElement = document.getElementById('username');
  const emailElement = document.getElementById('email');
  const roleElement = document.getElementById('role');
  const userPostsContainer = document.getElementById('user-posts');

  let userId = null; // Store user ID for fetching posts later

  // Fetch user data
  async function fetchUserData() {
    try {
      const response = await fetch('/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        usernameElement.textContent = data.user.username;
        emailElement.textContent = data.user.email;
        roleElement.textContent = data.user.role.charAt(0).toUpperCase() + data.user.role.slice(1);
        userId = data.user.id; // Save user ID for fetching posts
        fetchUserPosts(userId); // Fetch user's posts
      } else {
        console.warn('User not logged in or unauthorized.');
        window.location.href = '/login'; // Redirect guests
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  // Fetch user posts
  async function fetchUserPosts(id) {
  try {
    const response = await fetch(`/users/${id}/posts`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const posts = await response.json();

      // Clear existing posts
      userPostsContainer.innerHTML = '';

      if (posts.length === 0) {
        userPostsContainer.innerHTML = '<p class="text-gray-500">No posts yet.</p>';
        return;
      }

      // Populate user posts
      posts.forEach((post) => {
        const postElement = document.createElement('li');
        postElement.classList.add('bg-gray-200', 'p-4', 'rounded-md', 'shadow-sm');
        postElement.innerHTML = `
          <article>
            <img
              src="${post.image_path}"
              alt="${post.caption}"
              class="w-full rounded-md mb-2"
            />
            <p class="text-gray-800"><strong>Caption:</strong> ${post.caption}</p>
            <p class="text-sm text-gray-500">${new Date(post.created_at).toLocaleString()}</p>
            <button
              class="delete-post-btn px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              data-post-id="${post.id}"
            >
              Delete
            </button>
          </article>
        `;
        userPostsContainer.appendChild(postElement);
      });
    } else {
      console.error('Failed to fetch user posts.');
      userPostsContainer.innerHTML = '<p class="text-red-500">Error loading posts.</p>';
    }
  } catch (error) {
    console.error('Error fetching user posts:', error);
    userPostsContainer.innerHTML = '<p class="text-red-500">Unexpected error occurred.</p>';
  }
}

// Function to delete a post
async function deletePost(postId) {
  try {
    const response = await fetch(`/posts/${postId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      console.log(`Post ${postId} deleted successfully.`);
      // Re-fetch posts to update the list
      fetchUserPosts(userId); // Assuming `userId` is available in scope
    } else {
      const error = await response.json();
      console.error(`Failed to delete post: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting post:', error);
  }
}

// Add an event listener to handle delete button clicks
userPostsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-post-btn')) {
    const postId = e.target.getAttribute('data-post-id');
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
    }
  }
});

  // Handle image upload
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent traditional form submission

    const formData = new FormData(uploadForm); // Collect form data

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        messageElement.textContent = 'Image uploaded successfully!';
        messageElement.classList.add('text-green-500');
        console.log('Uploaded image URL:', result.imageUrl);

        // Refresh user posts after successful upload
        if (userId) {
          fetchUserPosts(userId);
        }
      } else {
        const error = await response.json();
        messageElement.textContent = `Error: ${error.message}`;
        messageElement.classList.add('text-red-500');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      messageElement.textContent = 'Unexpected error occurred.';
      messageElement.classList.add('text-red-500');
    }
  });

  fetchUserData(); // Call fetchUserData on page load
});
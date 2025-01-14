async function fetchPosts() {
  try {
    const response = await fetch('/posts');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

fetchPosts().then((data) => {
  if (!data || !Array.isArray(data)) {
    console.error('No posts available');
    return;
  }

  const postsContainer = document.getElementById('feed-list');
  postsContainer.innerHTML = ''; // Clear previous posts

  data.forEach((post) => {
    const postElement = document.createElement('li');
    postElement.classList.add(
      'bg-white',
      'rounded-lg',
      'shadow-lg',
      'p-4',
      'border',
      'border-gray-200',
      'hover:shadow-xl',
      'transition-all',
      'duration-300'
    );

    postElement.innerHTML = `
      <article class="flex flex-col space-y-4">
        <!-- Header Section -->
        <div class="flex items-center gap-4">
          <img src="./assets/profile-pic/default.png" 
               class="w-14 h-14 rounded-full border-2 border-blue-500 shadow-md" />
          <div>
            <p class="text-lg font-bold">${post.username}</p>
            <p class="text-sm text-gray-500">${formatPostDate(post.created_at)}</p>
          </div>
        </div>

        <!-- Post Image -->
        <img src="${post.image_path}" 
             alt="Post image" 
             class="rounded-lg object-cover border border-gray-300 max-h-[400px] w-full shadow-md" />

        <!-- Caption -->
        <p class="text-lg text-gray-800 font-medium">${post.caption}</p>
      </article>
    `;

    postsContainer.appendChild(postElement);
  });
});

// Helper function to format date as "Tuesday 18:38"
function formatPostDate(inputDate) {
    const date = new Date(inputDate);
    return new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date);
}
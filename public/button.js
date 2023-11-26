// Open volunteer form using button in section4

function volunteer_click_button() {
  console.log("helllo");
    window.location.href="/volunteering";
}


document.addEventListener('DOMContentLoaded', async () => {
  const blogPostsContainer = document.getElementById('blogPosts');
  
  // Fetch and display blog posts
  const fetchPosts = async () => {
      const response = await fetch('/api/posts');
      const posts = await response.json();

      blogPostsContainer.innerHTML = '';

      posts.forEach(post => {
          const postElement = document.createElement('div');
          postElement.classList.add('blog-post'); // Add your desired class name here
          postElement.innerHTML = `
              <h2>${post.title}</h2>
              <p>${post.content}</p>
          `;
          blogPostsContainer.appendChild(postElement);
      });
  };

  // Initial fetch
  await fetchPosts();

  // Create a new blog post
  const newPostForm = document.getElementById('newPostForm');

  newPostForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const title = document.getElementById('title').value;
      const content = document.getElementById('content').value;

      const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
          // Fetch and display updated blog posts after creating a new post
          await fetchPosts();
      } else {
          alert('Error creating a new blog post');
      }
  });
});

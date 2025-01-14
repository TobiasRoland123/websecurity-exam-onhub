DROP TABLE IF EXISTS users_posts;

-- Create the users_posts table with foreign key to both posts and users
CREATE TABLE users_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
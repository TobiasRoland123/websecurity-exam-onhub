USE instaxdb;

DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_path VARCHAR(255) NOT NULL,
    caption TEXT NOT NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_fk INT NOT NULL,
    FOREIGN KEY (user_fk) REFERENCES users(id)
);
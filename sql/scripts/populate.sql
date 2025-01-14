USE instaxdb;

-- Clear existing data
DELETE FROM posts;
DELETE FROM users;

-- Insert Admin User with a hashed password
INSERT INTO users (username, email, password, role)
VALUES (
    'adminUser',
    'admin@example.com',
    '$2y$10$icWDBui0w.FeBsiH.cgMwOYL0bXzvAFgsRMsUJgPBNYQ8nOZy9PfK',
    'admin'
);
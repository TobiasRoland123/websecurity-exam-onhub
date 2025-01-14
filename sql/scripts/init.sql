-- init db
CREATE DATABASE instaxdb;

-- Initialize tables
SOURCE /docker-entrypoint-initdb.d/entities/users-init.sql;
SOURCE /docker-entrypoint-initdb.d/entities/posts-init.sql;

-- Populate database with initial data
SOURCE /docker-entrypoint-initdb.d/populate.sql;
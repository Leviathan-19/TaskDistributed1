CREATE TABLE users (
    id_users SERIAL PRIMARY KEY,
    mail_users VARCHAR(255) UNIQUE NOT NULL,
    password_users VARCHAR(255) NOT NULL
);

CREATE TABLE searches (
    id_search SERIAL PRIMARY KEY,
    id_user INTEGER REFERENCES users(id_users) ON DELETE CASCADE,
    words VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

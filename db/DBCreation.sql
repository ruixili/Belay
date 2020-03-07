DROP DATABASE IF EXISTS belay;
CREATE DATABASE belay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;;
USE belay;

CREATE TABLE users
(
    email VARCHAR(60) NOT NULL,
    username VARCHAR(60) NOT NULL,
    password BINARY(60) NOT NULL,
    timestamp DATETIME DEFAULT NOW(),
    PRIMARY KEY (email)
);

CREATE TABLE channels(
    channelname VARCHAR(60) NOT NULL,
    `desc` VARCHAR(200),
    timestamp DATETIME DEFAULT NOW(),
    PRIMARY KEY (channelname)
);

CREATE TABLE messages(
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(60) NOT NULL,
    channelname VARCHAR(60) NOT NULL,
    text VARCHAR(200),
    timestamp DATETIME DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (email) REFERENCES users(email),
    FOREIGN KEY (channelname) REFERENCES channels(channelname)
);


INSERT INTO users VALUES("rxli@uchicago.edu", "admin", "123456", NOW());
INSERT INTO channels VALUES("Cat", "Channel Cat is share information about cat.", NOW());
INSERT INTO channels VALUES("Dog", "Channel Dog is share information about dog.", NOW());
INSERT INTO channels VALUES("Panda", "Channel Panda is share information about panda.", NOW());
INSERT INTO messages(email, channelname, text, timestamp) VALUES("rxli@uchicago.edu", "Cat", "1", NOW());

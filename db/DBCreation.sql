DROP DATABASE IF EXISTS belay;
CREATE DATABASE belay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;;
USE belay;

CREATE TABLE users
(
    email VARCHAR(30) NOT NULL,
    username VARCHAR(30) NOT NULL,
    password BINARY(60) NOT NULL,
    timestamp DATETIME DEFAULT NOW(),
    PRIMARY KEY (email)
);

CREATE TABLE channels(
    name VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    `desc` VARCHAR(160),
    timestamp DATETIME DEFAULT NOW(),
    PRIMARY KEY (name),
    FOREIGN KEY (email) REFERENCES users(email)
);


CREATE TABLE channel_cat(
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(30) NOT NULL,
    text VARCHAR(160),
    timestamp DATETIME DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (email) REFERENCES users(email)
);

CREATE TABLE channel_cat_thread(
    tid MEDIUMINT NOT NULL AUTO_INCREMENT,
    id INT NOT NULL,
    email VARCHAR(30) NOT NULL,
    text VARCHAR(160),
    timestamp DATETIME DEFAULT NOW(),
    PRIMARY KEY (tid),
    FOREIGN KEY (id) REFERENCES channel_cat(id),
    FOREIGN KEY (email) REFERENCES users(email)
);


INSERT INTO users VALUES("rxli@uchicago.edu", "admin", "123456", NOW());
INSERT INTO channels VALUES("Cat", "rxli@uchicago.edu", "Channel Cat is share information about cat.", NOW());
INSERT INTO channels VALUES("Dog", "rxli@uchicago.edu", "Channel Dog is share information about dog.", NOW());
INSERT INTO channels VALUES("Panda", "rxli@uchicago.edu", "Channel Panda is share information about panda.", NOW());


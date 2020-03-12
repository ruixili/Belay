-- sudo mysql -u root < DBTableCreation.sql

USE rxli;

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
    timestamp DATETIME DEFAULT NOW(),
    PRIMARY KEY (channelname)
);

CREATE TABLE messages(
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(60) NOT NULL,
    channelname VARCHAR(60) NOT NULL,
    text VARCHAR(200),
    timestamp DATETIME DEFAULT NOW(),
    replyid INT DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (email) REFERENCES users(email),
    FOREIGN KEY (channelname) REFERENCES channels(channelname)
);

-- initialization
INSERT INTO users VALUES("rxli@uchicago.edu", "admin", "123456", NOW());
INSERT INTO channels VALUES("Cat", NOW());
INSERT INTO channels VALUES("Dog", NOW());
INSERT INTO channels VALUES("Panda", NOW());
INSERT INTO messages(email, channelname, text) VALUES("rxli@uchicago.edu", "Cat", "hhh");

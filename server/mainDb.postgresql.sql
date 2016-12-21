DROP TABLE IF EXISTS organisation;
CREATE TABLE organisation(id integer primary key, name text, username text, password text, dbName text, canSendEmails tinyint);

INSERT INTO organisation VALUES(1, 'Guest', 'guest', '', 'guest', 0);
INSERT INTO organisation VALUES(2, 'Umbel Organics', 'umbel', 'password', 'umbel', 1);
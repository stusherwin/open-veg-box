DROP TABLE IF EXISTS organisation;
CREATE TABLE organisation(id integer primary key, name text, username text, password text, dbName text, canSendEmails tinyint, isPostGres tinyint);

INSERT INTO organisation VALUES(1, 'Guest', 'guest', '', 'guest', 0, 0);
INSERT INTO organisation VALUES(2, 'Umbel Organics', 'umbel', 'password', 'umbel', 1, 1);
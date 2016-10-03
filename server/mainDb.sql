DROP TABLE IF EXISTS organisation;
CREATE TABLE organisation(id integer primary key, name text, username text, password text, dbName text);

INSERT INTO organisation VALUES(1, 'Guest', 'guest', '', 'guest');
INSERT INTO organisation VALUES(2, 'Umbel Organics', 'umbel', 'password', 'umbel');
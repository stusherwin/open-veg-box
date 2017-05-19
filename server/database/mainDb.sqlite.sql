DROP TABLE IF EXISTS organisation;
CREATE TABLE organisation(id integer primary key, name text, username text, password text, canSendEmails tinyint, dbType text, dbConfig text);

INSERT INTO organisation VALUES(1, 'Guest', 'guest', '', 0, 'sqlite', '{
  "dbName": "guest"
}');

INSERT INTO organisation VALUES(2, 'Umbel Organics', 'umbel', 'password', 1, 'postgres', '{
  "host": "localhost",
  "port": 5432,
  "database": "umbel",
  "user": "openvegbox",
  "password": "password"
}');
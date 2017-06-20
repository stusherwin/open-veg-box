DROP TABLE IF EXISTS organisation;
CREATE TABLE organisation(id integer primary key, name text, username text, password text, canSendEmails boolean, dbType text, connectionString text);

INSERT INTO organisation VALUES(1, 'Guest', 'guest', '', FALSE, 'postgres', 'guest',
  'postgres://openvegbox:password@localhost:5432/guest');
INSERT INTO organisation VALUES(2, 'Umbel Organics', 'umbel', 'password', TRUE, 'postgres',
  --postgres://username:password@host:port/database
  'postgres://openvegbox:password@localhost:5432/umbel');

--GRANT ALL ON ALL TABLES IN SCHEMA public TO openvegbox;
--GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO openvegbox;
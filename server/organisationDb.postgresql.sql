DROP TABLE IF EXISTS round_customer;
DROP TABLE IF EXISTS round;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS product;

CREATE TABLE round(id serial primary key, name text);
CREATE TABLE customer(id serial primary key, name text, address text, tel1 text null, tel2 text null, email text null);
CREATE TABLE product(id serial primary key, name text, price real, unitType text, unitQuantity real);
CREATE TABLE round_customer(
  roundId integer NOT NULL REFERENCES round(id),
  customerId integer NOT NULL REFERENCES customer(id),
  PRIMARY KEY(roundId, customerId)
);

GRANT ALL ON ALL TABLES IN SCHEMA public TO openvegbox;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO openvegbox;

------
------

INSERT INTO product (name, price, unitType, unitQuantity) VALUES('Potatoes',0.9,'perKg',1.0);
INSERT INTO product (name, price, unitType, unitQuantity) VALUES('Onions',1.1,'perKg',1.0);
INSERT INTO product (name, price, unitType, unitQuantity) VALUES('Carrots',1.2,'perKg',1.0);
INSERT INTO product (name, price, unitType, unitQuantity) VALUES('Garlic (bulb)',0.7,'each',1.0);
INSERT INTO product (name, price, unitType, unitQuantity) VALUES('Bananas',2.5,'perKg',0.5);
INSERT INTO product (name, price, unitType, unitQuantity) VALUES('Apples',3.0,'perKg',0.5);
INSERT INTO product (name, price, unitType, unitQuantity) VALUES('Lemons',0.5,'each',1.0);

INSERT INTO round (name) VALUES('Ableton & Biddleton');

INSERT INTO customer (name, address, tel1, email) VALUES('Andrew Atkinson','10 Acacia Avenue
Ableton
A11 1AA','07324 358774','andrew@atkinson.com');
INSERT INTO round_customer (roundId, customerId) VALUES(currval(pg_get_serial_sequence('round','id')), currval(pg_get_serial_sequence('customer','id')));

INSERT INTO customer (name, address, tel1, email) VALUES('Betty Barnes','23 Beech Boulevard
Biddleton
B22 2BB','07324 358774','betty@barnes.com');
INSERT INTO round_customer (roundId, customerId) VALUES(currval(pg_get_serial_sequence('round','id')), currval(pg_get_serial_sequence('customer','id')));

INSERT INTO round (name) VALUES('Chompton & Digby');

INSERT INTO customer (name, address, tel1, email) VALUES('Christine Cook','3a Cedar Close
Chompton
C33 3CC','07324 358774','christine@cook.com');
INSERT INTO round_customer (roundId, customerId) VALUES(currval(pg_get_serial_sequence('round','id')), currval(pg_get_serial_sequence('customer','id')));

INSERT INTO customer (name, address, tel1, email) VALUES('Derek Draper','4 Durian Drive
Digby
D44 4DD','07324 358774','derek@draper.com');
INSERT INTO round_customer (roundId, customerId) VALUES(currval(pg_get_serial_sequence('round','id')), currval(pg_get_serial_sequence('customer','id')));
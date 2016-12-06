DROP TABLE IF EXISTS round_customer;
CREATE TABLE round_customer(
  roundId integer NOT NULL REFERENCES round(id),
  customerId integer NOT NULL REFERENCES customer(id),
  PRIMARY KEY(roundId, customerId)
);

DROP TABLE IF EXISTS round;
CREATE TABLE round(id integer primary key, name text);

DROP TABLE IF EXISTS customer;
CREATE TABLE customer(id integer primary key, name text, address text, tel1 text null, tel2 text null, email text null);

DROP TABLE IF EXISTS product;
CREATE TABLE product(id integer primary key, name text, price real, unitType text, unitQuantity real);

------
------

INSERT INTO product VALUES(1,'Potatoes',0.9,'perKg',1.0);
INSERT INTO product VALUES(2,'Onions',1.1,'perKg',1.0);
INSERT INTO product VALUES(3,'Carrots',1.2,'perKg',1.0);
INSERT INTO product VALUES(4,'Garlic (bulb)',0.7,'each',1.0);
INSERT INTO product VALUES(5,'Bananas',2.5,'perKg',0.5);
INSERT INTO product VALUES(6,'Apples',3.0,'perKg',0.5);
INSERT INTO product VALUES(7,'Lemons',0.5,'each',1.0);

INSERT INTO customer VALUES(1,'Andrew Atkinson','10 Acacia Avenue
Ableton
A11 1AA','07324 358774',null,'andrew@atkinson.com');
INSERT INTO customer VALUES(2,'Betty Barnes','23 Beech Boulevard
Biddleton
B22 2BB','07324 358774',null,'betty@barnes.com');
INSERT INTO customer VALUES(3,'Christine Cook','3a Cedar Close
Chompton
C33 3CC','07324 358774',null,'christine@cook.com');
INSERT INTO customer VALUES(4,'Derek Draper','4 Durian Drive
Digby
D44 4DD','07324 358774',null,'derek@draper.com');

INSERT INTO round VALUES(1,'Ableton & Biddleton');
INSERT INTO round VALUES(2,'Chompton & Digby');

INSERT INTO round_customer VALUES(1, 1);
INSERT INTO round_customer VALUES(1, 2);
INSERT INTO round_customer VALUES(2, 3);
INSERT INTO round_customer VALUES(2, 4);

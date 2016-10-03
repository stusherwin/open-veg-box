DROP TABLE IF EXISTS product;
CREATE TABLE product(id integer primary key, name text, price real, unitType text, unitQuantity real);

DROP TABLE IF EXISTS customer;
CREATE TABLE customer(id integer primary key, name text, address text, tel1 text null, tel2 text null, email text null);

DROP TABLE IF EXISTS round;
CREATE TABLE round(id integer primary key, name text);

------
------

INSERT INTO product VALUES(1,'Carrots',0.7,'perKg',1.0);

INSERT INTO customer VALUES(4,'Andrew Atkinson','10 Acacia Avenue
Ableton
A11 1AA','07324 358774',null,'andrew@atkinson.com');
INSERT INTO customer VALUES(3,'Betty Barnes','23 Beech Boulevard
Biddleton
B22 2BB','07324 358774',null,'betty@barnes.com');
INSERT INTO customer VALUES(2,'Christine Cook','3a Cedar Close
Chompton
C33 3CC','07324 358774',null,'christine@cook.com');
INSERT INTO customer VALUES(1,'Derek Draper','4 Durian Drive
Digby
D44 4DD','07324 358774',null,'derek@draper.com');

INSERT INTO round VALUES(2,'Round 1');
INSERT INTO round VALUES(1,'Round 2');
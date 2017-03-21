PRAGMA foreign_keys=on;

DROP TABLE IF EXISTS customerOrder_box;
DROP TABLE IF EXISTS customerOrder_product;
DROP TABLE IF EXISTS customerOrder;
DROP TABLE IF EXISTS round_customer;
DROP TABLE IF EXISTS round;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS box_product;
DROP TABLE IF EXISTS box;
DROP TABLE IF EXISTS product;

CREATE TABLE round(id integer primary key NOT NULL, name text NOT NULL);

CREATE TABLE customer(id integer primary key NOT NULL, name text NOT NULL, address text, tel1 text null, tel2 text null, email text null);

CREATE TABLE round_customer(
  roundId integer NOT NULL,
  customerId integer NOT NULL,
  PRIMARY KEY(roundId, customerId),
  FOREIGN KEY(roundId) REFERENCES round(id),
  FOREIGN KEY(customerId) REFERENCES customer(id)
);

CREATE TABLE box(id integer primary key NOT NULL, name text NOT NULL, price real NOT NULL);

CREATE TABLE product(id integer primary key NOT NULL, name text NOT NULL, price real NOT NULL, unitType text NOT NULL, unitQuantity real NOT NULL);

CREATE TABLE box_product(
  boxId integer NOT NULL,
  productId integer NOT NULL,
  quantity real NOT NULL,
  PRIMARY KEY(boxId, productId),
  FOREIGN KEY(boxId) REFERENCES box(id),
  FOREIGN KEY(productId) REFERENCES product(id)
);

CREATE TABLE customerOrder(
  id integer primary key NOT NULL,
  customerId integer NOT NULL,
  FOREIGN KEY(customerId) REFERENCES customer(id)
);

CREATE TABLE customerOrder_box(
  customerOrderId integer NOT NULL,
  boxId integer NOT NULL,
  quantity integer NOT NULL,
  PRIMARY KEY(customerOrderId, boxId),
  FOREIGN KEY(customerOrderId) REFERENCES customerOrder(id),
  FOREIGN KEY(boxId) REFERENCES box(id)
);

CREATE TABLE customerOrder_product(
  customerOrderId integer NOT NULL,
  productId integer NOT NULL,
  quantity real NOT NULL,
  PRIMARY KEY(customerOrderId, productId),
  FOREIGN KEY(customerOrderId) REFERENCES customerOrder(id),
  FOREIGN KEY(productId) REFERENCES product(id)
);

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

INSERT INTO box VALUES(1,'Big Box', 20.0);
INSERT INTO box VALUES(2,'Medium Box', 15.0);
INSERT INTO box VALUES(3,'Little Box', 10.0);

INSERT INTO box_product VALUES(1, 1, 2.5);
INSERT INTO box_product VALUES(1, 2, 1.0);
INSERT INTO box_product VALUES(1, 3, 2.0);
INSERT INTO box_product VALUES(1, 4, 3.0);
INSERT INTO box_product VALUES(1, 5, 0.6);
INSERT INTO box_product VALUES(1, 6, 3.5);
INSERT INTO box_product VALUES(1, 7, 2.0);

INSERT INTO box_product VALUES(2, 1, 2.0);
INSERT INTO box_product VALUES(2, 2, 0.75);
INSERT INTO box_product VALUES(2, 3, 1.5);
INSERT INTO box_product VALUES(2, 4, 2.0);

INSERT INTO box_product VALUES(3, 1, 1.0);
INSERT INTO box_product VALUES(3, 2, 0.5);

INSERT INTO customerOrder VALUES(1, 1);
INSERT INTO customerOrder VALUES(2, 2);
INSERT INTO customerOrder VALUES(3, 3);
INSERT INTO customerOrder VALUES(4, 4);

INSERT INTO customerOrder_box VALUES(1, 1, 1);
INSERT INTO customerOrder_box VALUES(2, 2, 1);
INSERT INTO customerOrder_box VALUES(2, 3, 1);
INSERT INTO customerOrder_box VALUES(3, 3, 2);
INSERT INTO customerOrder_box VALUES(4, 3, 1);

INSERT INTO customerOrder_product VALUES(1, 7, 5);
INSERT INTO customerOrder_product VALUES(4, 5, 1.0);
INSERT INTO customerOrder_product VALUES(4, 6, 1.5);
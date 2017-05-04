DO $$
DECLARE boxId1 integer;
DECLARE boxId2 integer;
DECLARE boxId3 integer;
DECLARE productId1 integer;
DECLARE productId2 integer;
DECLARE productId3 integer;
DECLARE productId4 integer;
DECLARE productId5 integer;
DECLARE productId6 integer;
DECLARE productId7 integer;
DECLARE roundId1 integer;
DECLARE roundId2 integer;
DECLARE customerId1 integer;
DECLARE customerId2 integer;
DECLARE customerId3 integer;
DECLARE customerId4 integer;
DECLARE orderId1 integer;
DECLARE orderId2 integer;
DECLARE orderId3 integer;
DECLARE orderId4 integer;
BEGIN
  DROP TABLE IF EXISTS round_customer;
  DROP TABLE IF EXISTS round;
  DROP TABLE IF EXISTS order_box;
  DROP TABLE IF EXISTS order_product;
  DROP TABLE IF EXISTS "order";
  DROP TABLE IF EXISTS customer;
  DROP TABLE IF EXISTS box_product;
  DROP TABLE IF EXISTS box;
  DROP TABLE IF EXISTS product;
  
  CREATE TABLE round(id serial primary key NOT NULL, name text NOT NULL);
  CREATE TABLE customer(id serial primary key NOT NULL, firstName text NOT NULL, surname text NOT NULL, address text, tel1 text null, tel2 text null, email text null);
  CREATE TABLE round_customer(
    roundId integer NOT NULL REFERENCES round(id),
    customerId integer NOT NULL REFERENCES customer(id),
    PRIMARY KEY(roundId, customerId)
  );
  CREATE TABLE box(id serial primary key NOT NULL, name text NOT NULL, price real NOT NULL);
  CREATE TABLE product(id serial primary key NOT NULL, name text NOT NULL, price real NOT NULL, unitType text NOT NULL, unitQuantity real);
  CREATE TABLE box_product(
    boxId integer NOT NULL REFERENCES box(id),
    productId integer NOT NULL REFERENCES product(id),
    quantity real NOT NULL,
    PRIMARY KEY(boxId, productId)
  );

  CREATE TABLE "order"(
    id serial primary key NOT NULL, 
    customerId integer NOT NULL REFERENCES customer(id)
  );

  CREATE TABLE order_box(
    orderId integer NOT NULL REFERENCES "order"(id),
    boxId integer NOT NULL REFERENCES box(id),
    quantity integer NOT NULL,
    PRIMARY KEY(orderId, boxId)
  );

  CREATE TABLE order_product(
    orderId integer NOT NULL REFERENCES "order"(id),
    productId integer NOT NULL REFERENCES product(id),
    quantity real NOT NULL,
    PRIMARY KEY(orderId, productId)
  );


  -- GRANT ALL ON ALL TABLES IN SCHEMA public TO openvegbox;
  -- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO openvegbox;

  ------
  ------

  INSERT INTO box (name, price) VALUES('Big Box', 20.0);
  INSERT INTO box (name, price) VALUES('Medium Box', 15.0);
  INSERT INTO box (name, price) VALUES('Little Box', 10.0);
  
  SELECT id from box where name = 'Big Box' INTO boxId1;
  SELECT id from box where name = 'Medium Box' INTO boxId2;
  SELECT id from box where name = 'Little Box' INTO boxId3;

  INSERT INTO product (name, price, unitType, unitQuantity) VALUES('Potatoes',0.9,'perKg',1.0);
  INSERT INTO product (name, price, unitType, unitQuantity) VALUES('Onions',1.1,'perKg',1.0);
  INSERT INTO product (name, price, unitType, unitQuantity) VALUES('Carrots',1.2,'perKg',1.0);
  INSERT INTO product (name, price, unitType, unitQuantity) VALUES('Garlic (bulb)',0.7,'each',1.0);
  INSERT INTO product (name, price, unitType, unitQuantity) VALUES('Bananas',2.5,'perKg',0.5);
  INSERT INTO product (name, price, unitType, unitQuantity) VALUES('Apples',3.0,'perKg',0.5);
  INSERT INTO product (name, price, unitType, unitQuantity) VALUES('Lemons',0.5,'each',1.0);

  SELECT id from product where name = 'Potatoes' INTO productId1;
  SELECT id from product where name = 'Onions' INTO productId2;
  SELECT id from product where name = 'Carrots' INTO productId3;
  SELECT id from product where name = 'Garlic (bulb)' INTO productId4;
  SELECT id from product where name = 'Bananas' INTO productId5;
  SELECT id from product where name = 'Apples' INTO productId6;
  SELECT id from product where name = 'Lemons' INTO productId7;

  INSERT INTO box_product (boxId, productId, quantity) VALUES(boxId1, productId1, 2.5);
  INSERT INTO box_product (boxId, productId, quantity) VALUES(boxId1, productId2, 1.0);
  INSERT INTO box_product (boxId, productId, quantity) VALUES(boxId1, productId3, 2.0);
  INSERT INTO box_product (boxId, productId, quantity) VALUES(boxId1, productId4, 3.0);
  INSERT INTO box_product (boxId, productId, quantity) VALUES(boxId1, productId5, 0.6);
  INSERT INTO box_product (boxId, productId, quantity) VALUES(boxId1, productId6, 0.5);
  INSERT INTO box_product (boxId, productId, quantity) VALUES(boxId1, productId7, 2.0);
  
  INSERT INTO box_product (boxId, productId, quantity) VALUES(boxId2, productId1, 2.0);
  INSERT INTO box_product (boxId, productId, quantity) VALUES(boxId2, productId2, 0.75);
  INSERT INTO box_product (boxId, productId, quantity) VALUES(boxId2, productId3, 1.5);
  INSERT INTO box_product (boxId, productId, quantity) VALUES(boxId2, productId4, 2.0);
  
  INSERT INTO box_product (boxId, productId, quantity) VALUES(boxId3, productId1, 1.0);
  INSERT INTO box_product (boxId, productId, quantity) VALUES(boxId3, productId2, 0.5);

  INSERT INTO round (name) VALUES('Ableton & Biddleton');
  INSERT INTO round (name) VALUES('Chompton & Digby');
  
  SELECT id from round where name = 'Ableton & Biddleton' INTO roundId1;
  SELECT id from round where name = 'Chompton & Digby' INTO roundId2;

  INSERT INTO customer (firstName, surname, address, tel1, email) VALUES('Andrew', 'Atkinson','10 Acacia Avenue
Ableton
A11 1AA','07324 358774','andrew@atkinson.com');
  INSERT INTO customer (firstName, surname, address, tel1, email) VALUES('Betty', 'Barnes','23 Beech Boulevard
Biddleton
B22 2BB','07324 358774','betty@barnes.com');
  INSERT INTO customer (firstName, surname, address, tel1, email) VALUES('Christine', 'Cook','3a Cedar Close
Chompton
C33 3CC','07324 358774','christine@cook.com');
  INSERT INTO customer (firstName, surname, address, tel1, email) VALUES('Derek', 'Draper','4 Durian Drive
Digby
D44 4DD','07324 358774','derek@draper.com');

  SELECT id from customer where firstName = 'Andrew' INTO customerId1;
  SELECT id from customer where firstName = 'Betty' INTO customerId2;
  SELECT id from customer where firstName = 'Christine' INTO customerId3;
  SELECT id from customer where firstName = 'Derek' INTO customerId4;

  INSERT INTO round_customer (roundId, customerId) VALUES(roundId1, customerId1);
  INSERT INTO round_customer (roundId, customerId) VALUES(roundId1, customerId2);
  INSERT INTO round_customer (roundId, customerId) VALUES(roundId2, customerId3);
  INSERT INTO round_customer (roundId, customerId) VALUES(roundId2, customerId4);

  INSERT INTO "order" (customerId) VALUES(customerId1);
  INSERT INTO "order" (customerId) VALUES(customerId2);
  INSERT INTO "order" (customerId) VALUES(customerId3);
  INSERT INTO "order" (customerId) VALUES(customerId4);

  SELECT id from "order" where customerId = customerId1 INTO orderId1;
  SELECT id from "order" where customerId = customerId2 INTO orderId2;
  SELECT id from "order" where customerId = customerId3 INTO orderId3;
  SELECT id from "order" where customerId = customerId4 INTO orderId4;

  INSERT INTO order_box (orderId, boxId, quantity) VALUES(orderId1, boxId1, 1);
  INSERT INTO order_box (orderId, boxId, quantity) VALUES(orderId2, boxId2, 1);
  INSERT INTO order_box (orderId, boxId, quantity) VALUES(orderId2, boxId3, 1);
  INSERT INTO order_box (orderId, boxId, quantity) VALUES(orderId3, boxId3, 2);
  INSERT INTO order_box (orderId, boxId, quantity) VALUES(orderId4, boxId3, 1);

  INSERT INTO order_product (orderId, productId, quantity) VALUES(orderId1, productId7, 5);
  INSERT INTO order_product (orderId, productId, quantity) VALUES(orderId4, productId5, 1.0);
  INSERT INTO order_product (orderId, productId, quantity) VALUES(orderId4, productId6, 1.5);
END $$


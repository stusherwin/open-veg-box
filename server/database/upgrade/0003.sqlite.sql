PRAGMA foreign_keys=on;

ALTER TABLE round ADD nextDeliveryDate text NULL;
ALTER TABLE round_customer ADD excludedFromNextDelivery integer NULL; --TODO: should be not null

update round_customer set excludedFromNextDelivery = 0;
-- pragma writable_schema = 1;
-- update sqlite_master set sql = 'CREATE TABLE round_customer(roundId integer NOT NULL, customerId integer NOT NULL, excludedFromNextDelivery integer NOT NULL, PRIMARY KEY(roundId, customerId), FOREIGN KEY(roundId) REFERENCES round(id), FOREIGN KEY(customerId) REFERENCES customer(id))' where name = 'round_customer';
-- pragma writable_schema = 0;

CREATE TABLE historicOrder(
  id integer primary key NOT NULL, 
  customerId integer NOT NULL REFERENCES customer(id),
  deliveryId integer NOT NULL REFERENCES delivery(id),
  total real NOT NULL
);

CREATE TABLE historicOrderedBox(
  id integer primary key NOT NULL,       
  orderId integer NOT NULL REFERENCES historicOrder(id),
  boxId integer NOT NULL,
  name text NOT NULL,
  price real NOT NULL,
  quantity integer NOT NULL
);

CREATE TABLE historicOrderedBoxProduct(
  id integer primary key NOT NULL,       
  orderedBoxId integer NOT NULL REFERENCES historicOrderedBox(id),
  productId integer NOT NULL,
  name text NOT NULL,
  unitType text NOT NULL,
  price real NOT NULL,
  quantity real NOT NULL
);

CREATE TABLE historicOrderedProduct(
  id integer primary key NOT NULL,       
  orderId integer NOT NULL REFERENCES historicOrder(id),
  productId integer NOT NULL,
  name text NOT NULL,
  unitType text NOT NULL,
  price real NOT NULL,
  quantity real NOT NULL
);

insert into historicOrder(id, customerId, deliveryId, total) values(1, 1, 1, 45.0);

insert into historicOrderedBox(id, orderId, boxId, name, price, quantity)
values(1, 1, 1, 'Box box (old)', 21.0, 2);

insert into historicOrderedBoxProduct(orderedBoxId, productId, name, unitType, price, quantity)
values(1, 1, 'Potatoes (old)', 'perKg', 1, 3);

insert into historicOrderedBoxProduct(orderedBoxId, productId, name, unitType, price, quantity)
values(1, 5, 'Bananas (old)', 'perKg', 1.5, 3);

insert into historicOrderedBoxProduct(orderedBoxId, productId, name, unitType, price, quantity)
values(1, 6, 'Apples (old)', 'perKg', 1.2, 3);

insert into historicOrderedProduct(orderId, productId, name, unitType, price, quantity)
values(1, 1, 'Potatoes (old)', 'perKg', 1, 3);

insert into historicOrder(id, customerId, deliveryId, total) values(2, 2, 1, 39.8);

insert into historicOrderedBox(id, orderId, boxId, name, price, quantity)
values(2, 2, 1, 'Box box (old)', 21.0, 1);

insert into historicOrderedBoxProduct(orderedBoxId, productId, name, unitType, price, quantity)
values(2, 6, 'Apples (old)', 'perKg', 1.2, 3);

insert into historicOrderedBox(id, orderId, boxId, name, price, quantity)
values(3, 2, 2, 'Medium box (old)', 15.5, 1);

insert into historicOrderedBoxProduct(orderedBoxId, productId, name, unitType, price, quantity)
values(3, 6, 'Apples (old)', 'perKg', 1.2, 1);

insert into historicOrderedProduct(orderId, productId, name, unitType, price, quantity)
values(2, 3, 'Carrots (old)', 'perKg', 1.1, 3);
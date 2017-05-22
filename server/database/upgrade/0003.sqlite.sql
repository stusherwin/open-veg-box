PRAGMA foreign_keys=on;

CREATE TABLE historicOrder(
  id integer primary key NOT NULL, 
  customerId integer NOT NULL REFERENCES customer(id),
  deliveryId integer NOT NULL REFERENCES delivery(id)
);

CREATE TABLE historicOrderedBox(
  id integer primary key NOT NULL,       
  historicOrderId integer NOT NULL REFERENCES historicOrder(id),
  historicBoxId integer NOT NULL,
  historicBoxName text NOT NULL,
  historicBoxPrice real NOT NULL,
  quantity integer NOT NULL
);

CREATE TABLE historicOrderedProduct(
  id integer primary key NOT NULL,       
  historicOrderId integer NOT NULL REFERENCES historicOrder(id),
  historicProductId integer NOT NULL,
  historicProductName text NOT NULL,
  historicProductPrice real NOT NULL,
  quantity real NOT NULL
);

insert into historicOrder(id, customerId, deliveryId) values(1, 1, 1);

insert into historicOrderedBox(historicOrderId, historicBoxId, historicBoxName, historicBoxPrice, quantity)
values(1, 1, 'Box box (old)', 21.0, 2);

insert into historicOrderedProduct(historicOrderId, historicProductId, historicProductName, historicProductPrice, quantity)
values(1, 1, 'Potatoes (old)', 1, 3);

insert into historicOrder(id, customerId, deliveryId) values(2, 2, 1);

insert into historicOrderedBox(historicOrderId, historicBoxId, historicBoxName, historicBoxPrice, quantity)
values(2, 1, 'Box box (old)', 21.0, 1);

insert into historicOrderedBox(historicOrderId, historicBoxId, historicBoxName, historicBoxPrice, quantity)
values(2, 2, 'Medium box (old)', 15.5, 1);

insert into historicOrderedProduct(historicOrderId, historicProductId, historicProductName, historicProductPrice, quantity)
values(2, 3, 'Carrots (old)', 1.1, 3);
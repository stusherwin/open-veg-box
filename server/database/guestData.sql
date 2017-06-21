DO $$
declare bBig integer;
declare bMed integer;
declare bLit integer;
declare pPot integer;
declare pOn integer;
declare pCar integer;
declare pGar integer;
declare pBan integer;
declare pApp integer;
declare pLem integer;
declare rAB integer;
declare rCD integer;
declare cA integer;
declare cB integer;
declare cC integer;
declare cD integer;
declare oCA1 integer;
declare oCB1 integer;
declare oCC1 integer;
declare oCD1 integer;
declare dR1_20170102 integer;
declare dR1_20170109 integer;
declare dR1_20170116 integer;
declare ho_CA_dR1_20170102 integer;
declare hob_ho_CA_dR1_20170102_bBig integer;
declare ho_CB_dR1_20170102 integer;
declare hob_ho_CB_dR1_20170102_bBig integer;
declare hob_ho_CB_dR1_20170102_bMed integer;
declare cpA integer;
declare cpB integer;
declare cpC integer;
declare cpD integer;
begin
  delete from historicOrderedBoxProduct;
  alter sequence historicOrderedBoxProduct_id_seq restart with 1;
  delete from historicOrderedBox;
  alter sequence historicOrderedBox_id_seq restart with 1;
  delete from historicOrderedProduct;
  alter sequence historicOrderedProduct_id_seq restart with 1;
  delete from historicOrderDiscount;
  alter sequence historicOrderDiscount_id_seq restart with 1;
  delete from historicOrder;
  alter sequence historicOrder_id_seq restart with 1;
  delete from delivery;
  alter sequence delivery_id_seq restart with 1;
  delete from collectionPoint;
  alter sequence collectionPoint_id_seq restart with 1;
  delete from round_customer;
  delete from round;
  alter sequence round_id_seq restart with 1;
  delete from payment;
  alter sequence payment_id_seq restart with 1;
  delete from order_box;
  delete from order_product;
  delete from orderDiscount;
  alter sequence orderDiscount_id_seq restart with 1;
  delete from "order";
  alter sequence order_id_seq restart with 1;
  delete from customer;
  alter sequence customer_id_seq restart with 1;
  delete from box_product;
  delete from box;
  alter sequence box_id_seq restart with 1;
  delete from product;
  alter sequence product_id_seq restart with 1;
  
  insert into box (name, price) values('Big Box', 20.0);
  insert into box (name, price) values('Medium Box', 15.0);
  insert into box (name, price) values('Little Box', 10.0);
  
  select id from box where name = 'Big Box' into bBig;
  select id from box where name = 'Medium Box' into bMed;
  select id from box where name = 'Little Box' into bLit;

  insert into product (name, price, unitType, unitQuantity) values('Potatoes',0.9,'perKg',1.0);
  insert into product (name, price, unitType, unitQuantity) values('Onions',1.1,'perKg',1.0);
  insert into product (name, price, unitType, unitQuantity) values('Carrots',1.2,'perKg',1.0);
  insert into product (name, price, unitType, unitQuantity) values('Garlic (bulb)',0.7,'each',1.0);
  insert into product (name, price, unitType, unitQuantity) values('Bananas',2.5,'perKg',0.5);
  insert into product (name, price, unitType, unitQuantity) values('Apples',3.0,'perKg',0.5);
  insert into product (name, price, unitType, unitQuantity) values('Lemons',0.5,'each',1.0);

  select id from product where name = 'Potatoes' into pPot;
  select id from product where name = 'Onions' into pOn;
  select id from product where name = 'Carrots' into pCar;
  select id from product where name = 'Garlic (bulb)' into pGar;
  select id from product where name = 'Bananas' into pBan;
  select id from product where name = 'Apples' into pApp;
  select id from product where name = 'Lemons' into pLem;

  insert into box_product (boxId, productId, quantity) values(bBig, pPot, 2.5);
  insert into box_product (boxId, productId, quantity) values(bBig, pOn, 1.0);
  insert into box_product (boxId, productId, quantity) values(bBig, pCar, 2.0);
  insert into box_product (boxId, productId, quantity) values(bBig, pGar, 3.0);
  insert into box_product (boxId, productId, quantity) values(bBig, pBan, 0.6);
  insert into box_product (boxId, productId, quantity) values(bBig, pApp, 0.5);
  insert into box_product (boxId, productId, quantity) values(bBig, pLem, 2.0);
  
  insert into box_product (boxId, productId, quantity) values(bMed, pPot, 2.0);
  insert into box_product (boxId, productId, quantity) values(bMed, pOn, 0.75);
  insert into box_product (boxId, productId, quantity) values(bMed, pCar, 1.5);
  insert into box_product (boxId, productId, quantity) values(bMed, pGar, 2.0);
  
  insert into box_product (boxId, productId, quantity) values(bLit, pPot, 1.0);
  insert into box_product (boxId, productId, quantity) values(bLit, pOn, 0.5);

  insert into round (name, deliveryWeekday, nextDeliveryDate) values('Ableton & Biddleton', 5, null);
  insert into round (name, deliveryWeekday, nextDeliveryDate) values('Chompton & Digby', 2, null);
  
  select id from round where name = 'Ableton & Biddleton' into rAB;
  select id from round where name = 'Chompton & Digby' into rCD;

  insert into collectionPoint (roundId, name, address) values(rAB, 'Ableton Post Office', '1 The Lane, Ableton');
  insert into collectionPoint (roundId, name, address) values(rAB, 'The Dog & Duck, Biddleton', '1 Main Street, Biddleton');
  insert into collectionPoint (roundId, name, address) values(rCD, 'Veggie Cafe, Chompton', '1 High Street, Chompton');
  insert into collectionPoint (roundId, name, address) values(rCD, 'Jim''s House, Digby', '1 Jim Street, Digby');

  select id from collectionPoint where name = 'Ableton Post Office' into cpA;
  select id from collectionPoint where name = 'The Dog & Duck, Biddleton' into cpB;
  select id from collectionPoint where name = 'Veggie Cafe, Chompton' into cpC;
  select id from collectionPoint where name = 'Jim''s House, Digby' into cpD;

  insert into customer (firstName, surname, address, tel1, email, paymentMethod, paymentDetails) values('Andrew', 'Atkinson','10 Acacia Avenue
Ableton
A11 1AA','07324 358774','andrew@atkinson.com', 'card', 'Card number: 0123 4567 8901 2345');

  insert into customer (firstName, surname, address, tel1, email, paymentMethod, paymentDetails) values('Betty', 'Barnes','23 Beech Boulevard
Biddleton
B22 2BB','07324 358774','betty@barnes.com', 'directDebit', '£30, 2nd of every month');

  insert into customer (firstName, surname, address, tel1, email, paymentMethod, paymentDetails) values('Christine', 'Cook','3a Cedar Close
Chompton
C33 3CC','07324 358774','christine@cook.com', 'card', 'Card number: 1234 5678 9012 3456');

  insert into customer (firstName, surname, address, tel1, email, paymentMethod, paymentDetails) values('Derek', 'Draper','4 Durian Drive
Digby
D44 4DD','07324 358774','derek@draper.com', 'cash', 'Pays in cash every 4 weeks');

  select id from customer where firstName = 'Andrew' into cA;
  select id from customer where firstName = 'Betty' into cB;
  select id from customer where firstName = 'Christine' into cC;
  select id from customer where firstName = 'Derek' into cD;

  insert into round_customer (roundId, customerId, excludedFromNextDelivery, collectionPointId) values(rAB, cA, 0, null);
  insert into round_customer (roundId, customerId, excludedFromNextDelivery, collectionPointId) values(rAB, cB, 0, cpB);
  insert into round_customer (roundId, customerId, excludedFromNextDelivery, collectionPointId) values(rCD, cC, 0, cpC);
  insert into round_customer (roundId, customerId, excludedFromNextDelivery, collectionPointId) values(rCD, cD, 0, null);

  insert into "order" (customerId) values(cA);
  insert into "order" (customerId) values(cB);
  insert into "order" (customerId) values(cC);
  insert into "order" (customerId) values(cD);

  select id from "order" where customerId = cA into oCA1;
  select id from "order" where customerId = cB into oCB1;
  select id from "order" where customerId = cC into oCC1;
  select id from "order" where customerId = cD into oCD1;

  insert into order_box (orderId, boxId, quantity) values(oCA1, bBig, 1);
  insert into order_box (orderId, boxId, quantity) values(oCB1, bMed, 1);
  insert into order_box (orderId, boxId, quantity) values(oCB1, bLit, 1);
  insert into order_box (orderId, boxId, quantity) values(oCC1, bLit, 2);
  insert into order_box (orderId, boxId, quantity) values(oCD1, bLit, 1);

  insert into order_product (orderId, productId, quantity) values(oCA1, pLem, 5);
  insert into order_product (orderId, productId, quantity) values(oCD1, pBan, 1.0);
  insert into order_product (orderId, productId, quantity) values(oCD1, pApp, 1.5);

  insert into delivery(roundId, "date") values(1, '2017-01-02');
  insert into delivery(roundId, "date") values(1, '2017-01-09');
  insert into delivery(roundId, "date") values(1, '2017-01-16');

  select id from delivery where "date" = '2017-01-02' into dR1_20170102;
  select id from delivery where "date" = '2017-01-09' into dR1_20170109;
  select id from delivery where "date" = '2017-01-16' into dR1_20170116;

  insert into historicOrder(customerId, deliveryId, total) values(cA, dR1_20170102, 45.0);

  select id from historicOrder where customerId = cA and deliveryId = dR1_20170102 into ho_CA_dR1_20170102;

  insert into historicOrderedBox(orderId, boxId, name, price, quantity)
  values(ho_CA_dR1_20170102, bBig, 'Big box', 21.0, 2);

  select id from historicOrderedBox where orderId = ho_CA_dR1_20170102 and boxId = bBig into hob_ho_CA_dR1_20170102_bBig;

  insert into historicOrderedBoxProduct(orderedBoxId, productId, name, unitType, quantity)
  values(hob_ho_CA_dR1_20170102_bBig, pPot, 'Potatoes', 'perKg', 3);

  insert into historicOrderedBoxProduct(orderedBoxId, productId, name, unitType, quantity)
  values(hob_ho_CA_dR1_20170102_bBig, pBan, 'Bananas', 'perKg', 3);

  insert into historicOrderedBoxProduct(orderedBoxId, productId, name, unitType, quantity)
  values(hob_ho_CA_dR1_20170102_bBig, pApp, 'Apples', 'perKg', 3);

  insert into historicOrderedProduct(orderId, productId, name, unitType, price, quantity)
  values(ho_CA_dR1_20170102, pPot, 'Potatoes', 'perKg', 1, 3);

  insert into historicOrder(customerId, deliveryId, total) values(cB, dR1_20170102, 39.8);

  select id from historicOrder where customerId = cB and deliveryId = dR1_20170102 into ho_CB_dR1_20170102;

  insert into historicOrderedBox(orderId, boxId, name, price, quantity)
  values(ho_CB_dR1_20170102, bBig, 'Big box', 21.0, 1);

  select id from historicOrderedBox where orderId = ho_CB_dR1_20170102 and boxId = bBig into hob_ho_CB_dR1_20170102_bBig;

  insert into historicOrderedBoxProduct(orderedBoxId, productId, name, unitType, quantity)
  values(hob_ho_CB_dR1_20170102_bBig, pApp, 'Apples', 'perKg', 3);

  insert into historicOrderedBox(orderId, boxId, name, price, quantity)
  values(ho_CB_dR1_20170102, bMed, 'Medium box', 15.5, 1);

  select id from historicOrderedBox where orderId = ho_CB_dR1_20170102 and boxId = bMed into hob_ho_CB_dR1_20170102_bMed;

  insert into historicOrderedBoxProduct(orderedBoxId, productId, name, unitType, quantity)
  values(hob_ho_CB_dR1_20170102_bMed, pApp, 'Apples', 'perKg', 1);

  insert into historicOrderedProduct(orderId, productId, name, unitType, price, quantity)
  values(ho_CB_dR1_20170102, pCar, 'Carrots', 'perKg', 1.1, 3);
  
  insert into payment(customerId, "date", amount, notes) values(cA, '2017-06-01', 20.5, 'Initial payment');
  insert into payment(customerId, "date", amount, notes) values(cB, '2017-05-25', 100, '');

end $$
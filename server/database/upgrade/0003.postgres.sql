do $$
declare orderId1 integer;
declare orderId2 integer;

begin
  if not exists (select * from upgrade where scriptname = '0003') 
  then
    create table historicOrder(
      id serial primary key not null, 
      customerId integer not null references customer(id),
      deliveryId integer not null references delivery(id)
    );

    create table historicOrderedBox(
      id serial primary key not null,       
      orderId integer not null references historicOrder(id),
      boxId integer not null,
      name text not null,
      price real not null,
      quantity integer not null
    );

    create table historicOrderedProduct(
      id serial primary key not null,       
      orderId integer not null references historicOrder(id),
      productId integer not null,
      name text not null,
      unitType text not null,
      price real not null,
      quantity real not null
    );

    insert into historicOrder(customerId, deliveryId) values(1, 1);
    select max(id) from historicOrder into orderId1;

    insert into historicOrderedBox(orderId, boxId, name, price, quantity)
    values(orderId1, 1, 'Box box (old)', 21.0, 2);

    insert into historicOrderedProduct(historicOrderId, productId, name, unitType, price, quantity)
    values(orderId1, 1, 'Potatoes (old)', 'perKg', 1 3);

    insert into historicOrder(customerId, deliveryId) values(2, 1);
    select max(id) from historicOrder into orderId2;

    insert into historicOrderedBox(historicOrderId, boxId, name, price, quantity)
    values(orderId2, 1, 'Box box (old)', 21.0, 1);

    insert into historicOrderedBox(historicOrderId, boxId, name, price, quantity)
    values(orderId2, 2, 'Medium box (old)', 15.5, 1);
    
    insert into historicOrderedProduct(historicOrderId, productId, name, unitType, price, quantity)
    values(orderId2, 3, 'Carrots (old)', 'perKg', 1.1, 3);

    insert into upgrade(scriptname) values('0003');
    raise notice 'Upgraded.';
  else
    raise notice 'Already upgraded. No script was run.';
  end if;
end;
$$
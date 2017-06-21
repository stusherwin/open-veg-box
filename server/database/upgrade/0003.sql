do $$
begin
  if not exists (select * from upgrade where scriptname = '0003') 
  then
    drop table if exists historicOrderedBoxProduct cascade;
    drop table if exists historicOrderedBox cascade;
    drop table if exists historicOrderedProduct cascade;
    drop table if exists historicOrder cascade;
 
    alter table round add nextDeliveryDate date null;
    
    alter table round_customer add excludedFromNextDelivery integer null;
    update round_customer set excludedFromNextDelivery = 0;
    alter table round_customer alter excludedFromNextDelivery set not null;

    create table historicOrder(
      id serial primary key not null, 
      customerId integer not null references customer(id),
      deliveryId integer not null references delivery(id),
      total real not null
    );

    create table historicOrderedBox(
      id serial primary key not null,       
      orderId integer not null references historicOrder(id),
      boxId integer not null,
      name text not null,
      price real not null,
      quantity integer not null
    );

    create table historicOrderedBoxProduct(
      id serial primary key not null,       
      orderedBoxId integer not null references historicOrderedBox(id),
      productId integer not null,
      name text not null,
      unitType text not null,
      quantity real not null
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

    insert into upgrade(scriptname) values('0003');
    raise notice 'Upgraded.';
  else
    raise notice 'Already upgraded. No script was run.';
  end if;
end;
$$
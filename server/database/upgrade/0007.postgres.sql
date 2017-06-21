do $$
begin
  if not exists (select * from upgrade where scriptname = '0007') 
  then
    drop table if exists historicOrderDiscount cascade;

    create table historicOrderDiscount(
      id serial primary key not null,       
      orderId integer not null references historicOrder(id),
      discountId integer not null,
      name text not null,
      total real not null
    );

    insert into upgrade(scriptname) values('0007');
    raise notice 'Upgraded.';
  else
    raise notice 'Already upgraded. No script was run.';
  end if;
end;
$$
do $$
declare orderId1 integer;
declare orderId2 integer;

begin
  if not exists (select * from upgrade where scriptname = '0004') 
  then
    create table payment(
      id serial primary key not null, 
      customerId integer not null references customer(id),
      date date not null,
      amount real not null,
      notes text not null
   );

    insert into upgrade(scriptname) values('0004');
    raise notice 'Upgraded.';
  else
    raise notice 'Already upgraded. No script was run.';
  end if;
end;
$$
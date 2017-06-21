do $$
begin
  if not exists (select * from upgrade where scriptname = '0004') 
  then
    drop table if exists payment cascade;

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
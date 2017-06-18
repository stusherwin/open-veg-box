do $$
begin
  if not exists (select * from upgrade where scriptname = '0006') 
  then
    CREATE TABLE orderDiscount(
      id serial primary key NOT NULL, 
      orderId integer NOT NULL REFERENCES "order"(id),
      name text NOT NULL,
      total real NOT NULL
    );

    insert into upgrade(scriptname) values('0006');
    raise notice 'Upgraded.';
  else
    raise notice 'Already upgraded. No script was run.';
  end if;
end;
$$
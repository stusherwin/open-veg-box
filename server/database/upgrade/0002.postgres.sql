do $$
begin
  if not exists (select * from upgrade where scriptname = '0002') 
  then
    create table delivery(
      id serial primary key not null,
      roundId integer not null,
      date date not null,
      foreign key(roundId) references round(id)
    );

    insert into upgrade(scriptname) values('0002');
    raise notice 'Upgraded.';
  else
    raise notice 'Already upgraded. No script was run.';
  end if;
end;
$$
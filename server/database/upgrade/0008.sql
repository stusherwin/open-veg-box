do $$
begin
  if not exists (select * from upgrade where scriptname = '0008') 
  then
    drop table if exists collectionPoint cascade;

    create table collectionPoint(
      id serial primary key not null,       
      roundId integer not null references round(id),
      name text not null,
      address text not null
    );

    alter table round_customer add collectionPointId integer null references collectionPoint(id);

    insert into upgrade(scriptname) values('0008');
    raise notice 'Upgraded.';
  else
    raise notice 'Already upgraded. No script was run.';
  end if;
end;
$$
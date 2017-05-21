do $$
begin
  if not exists (select * from information_schema.tables where table_schema = 'public' and table_name = 'upgrade') 
  then
    create table upgrade(scriptname text not null);

    alter table round add deliveryWeekday int null;
    update round set deliveryWeekday = 5;
    alter table round alter deliveryWeekday set not null;

    insert into upgrade(scriptname) values('0001');
    raise notice 'Upgraded.';
  else
    raise notice 'Already upgraded. No script was run.';
  end if;
end;
$$
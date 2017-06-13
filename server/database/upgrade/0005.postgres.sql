do $$
begin
  if not exists (select * from upgrade where scriptname = '0005') 
  then
    alter table customer add paymentMethod text null;
    alter table customer add paymentDetails text null;
    update customer set paymentMethod = 'card';
    update customer set paymentDetails = '';
    alter table customer alter paymentMethod set not null;
    alter table customer alter paymentDetails set not null;

    insert into upgrade(scriptname) values('0005');
    raise notice 'Upgraded.';
  else
    raise notice 'Already upgraded. No script was run.';
  end if;
end;
$$
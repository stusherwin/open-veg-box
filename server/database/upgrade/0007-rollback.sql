do $$

begin
  if exists (select * from upgrade where scriptname = '0007') 
  then
    drop table if exists historicOrderDiscount;

    delete from upgrade where scriptname = '0007';
    
    raise notice 'Rolled back.';
  else
    raise notice 'No upgrade to roll back. No script was run.';
  end if;
end;
$$
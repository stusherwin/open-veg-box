do $$

begin
  if exists (select * from upgrade where scriptname = '0004') 
  then
    drop table if exists payment;

    delete from upgrade where scriptname = '0004';
    
    raise notice 'Rolled back.';
  else
    raise notice 'No upgrade to roll back. No script was run.';
  end if;
end;
$$
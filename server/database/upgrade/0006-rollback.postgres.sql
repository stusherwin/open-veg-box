do $$

begin
  if exists (select * from upgrade where scriptname = '0006') 
  then
    drop table if exists orderDiscount;

    delete from upgrade where scriptname = '0006';
    
    raise notice 'Rolled back.';
  else
    raise notice 'No upgrade to roll back. No script was run.';
  end if;
end;
$$
do $$
begin
  if exists (select * from upgrade where scriptname = '0002') 
  then
    drop table if exists delivery;

    delete from upgrade where scriptname = '0002';
    
    raise notice 'Rolled back.';
  else
    raise notice 'No upgrade to roll back. No script was run.';
  end if;
end;
$$
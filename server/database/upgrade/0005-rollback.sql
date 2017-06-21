do $$

begin
  if exists (select * from upgrade where scriptname = '0005') 
  then
    alter table customer drop paymentMethod;
    alter table customer drop paymentDetails;

    delete from upgrade where scriptname = '0005';
    
    raise notice 'Rolled back.';
  else
    raise notice 'No upgrade to roll back. No script was run.';
  end if;
end;
$$
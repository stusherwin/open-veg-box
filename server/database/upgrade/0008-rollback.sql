do $$

begin
  if exists (select * from upgrade where scriptname = '0008') 
  then
    drop table if exists collectionPoint;
    alter table round_customer drop collectionPointId;

    delete from upgrade where scriptname = '0008';
    
    raise notice 'Rolled back.';
  else
    raise notice 'No upgrade to roll back. No script was run.';
  end if;
end;
$$
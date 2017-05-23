do $$
declare orderId1 integer;
declare orderId2 integer;

begin
  if exists (select * from upgrade where scriptname = '0003') 
  then
    drop table if exists historicOrderedBoxProduct;
    drop table if exists historicOrderedBox;
    drop table if exists historicOrderedProduct;
    drop table if exists historicOrder;

    delete from upgrade where scriptname = '0003';
    
    raise notice 'Rolled back.';
  else
    raise notice 'No upgrade to roll back. No script was run.';
  end if;
end;
$$
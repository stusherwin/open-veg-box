do $$
declare orderId1 integer;
declare orderId2 integer;

begin
  if exists (select * from upgrade where scriptname = '0003') 
  then
    drop table historicOrder;
    drop table historicOrderedBox;
    drop table historicOrderedProduct;

    delete from upgrade where scriptname = '0003';
    
    raise notice 'Rolled back.';
  else
    raise notice 'No upgrade to roll back. No script was run.';
  end if;
end;
$$
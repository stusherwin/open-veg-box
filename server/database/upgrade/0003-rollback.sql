do $$

begin
  if exists (select * from upgrade where scriptname = '0003') 
  then
    drop table if exists historicOrderedBoxProduct;
    drop table if exists historicOrderedBox;
    drop table if exists historicOrderedProduct;
    drop table if exists historicOrder;

    alter table round drop nextDeliveryDate;
    alter table round_customer drop excludedFromNextDelivery;

    delete from upgrade where scriptname = '0003';
    
    raise notice 'Rolled back.';
  else
    raise notice 'No upgrade to roll back. No script was run.';
  end if;
end;
$$
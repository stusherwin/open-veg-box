PRAGMA foreign_keys=on;

alter table customer add paymentmethod text null;
alter table customer add paymentdetails text null;

update customer set paymentMethod = 'card' where id = 1;
update customer set paymentDetails = 'Card number: 0123 4567 8901 2345' where id = 1;

update customer set paymentMethod = 'directDebit' where id = 2;
update customer set paymentDetails = '£30, 2nd of every month' where id = 2;

update customer set paymentMethod = 'card' where id = 3;
update customer set paymentDetails = 'Card number: 1234 5678 9012 3456' where id = 3;

update customer set paymentMethod = 'cash' where id = 4;
update customer set paymentDetails = 'Pays in cash every 4 weeks' where id = 4;
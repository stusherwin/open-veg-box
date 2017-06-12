PRAGMA foreign_keys=on;

create table payment(
  id integer primary key not null, 
  customerId integer not null references customer(id),
  date date not null,
  amount real not null,
  notes text not null
);

insert into payment(id, customerId, date, amount, notes) values(1, 1, '2017-06-01', 20.5, 'Initial payment');
insert into payment(id, customerId, date, amount, notes) values(2, 2, '2017-05-25', 100, '');
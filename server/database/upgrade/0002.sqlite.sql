PRAGMA foreign_keys=on;

create table delivery(
  id integer primary key not null,
  roundId integer not null,
  date date not null,
  foreign key(roundId) references round(id)
);

insert into delivery(roundId, date, isComplete) values(1, '2017-01-02');
insert into delivery(roundId, date, isComplete) values(1, '2017-01-09');
insert into delivery(roundId, date, isComplete) values(1, '2017-01-16');

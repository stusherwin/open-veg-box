alter table round add deliveryWeekday int NULL;
update round set deliveryWeekday = 5 where id = 1;
update round set deliveryWeekday = 2 where id = 2;
pragma writable_schema = 1;
update sqlite_master set sql = 'CREATE TABLE round(id integer primary key NOT NULL, name text NOT NULL, deliveryweekday int NOT NULL)' where name = 'round';
pragma writable_schema = 0;


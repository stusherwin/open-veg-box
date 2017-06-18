CREATE TABLE orderDiscount(
  id integer primary key NOT NULL,
  orderId integer NOT NULL,
  name text NOT NULL,
  total real NOT NULL,
  FOREIGN KEY(orderId) REFERENCES [order](id)
);
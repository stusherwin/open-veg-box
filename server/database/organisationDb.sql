DO $$
BEGIN  
  drop table if exists round_customer cascade;
  drop table if exists round cascade;
  drop table if exists order_box cascade;
  drop table if exists order_product cascade;
  drop table if exists "order" cascade;
  drop table if exists customer cascade;
  drop table if exists box_product cascade;
  drop table if exists box cascade;
  drop table if exists product cascade;
  drop table if exists upgrade cascade;

  CREATE TABLE round(id serial primary key NOT NULL, name text NOT NULL);
  CREATE TABLE customer(id serial primary key NOT NULL, firstName text NOT NULL, surname text NOT NULL, address text, tel1 text null, tel2 text null, email text null);
  CREATE TABLE round_customer(
    roundId integer NOT NULL REFERENCES round(id),
    customerId integer NOT NULL REFERENCES customer(id),
    PRIMARY KEY(roundId, customerId)
  );
  CREATE TABLE box(id serial primary key NOT NULL, name text NOT NULL, price real NOT NULL);
  CREATE TABLE product(id serial primary key NOT NULL, name text NOT NULL, price real NOT NULL, unitType text NOT NULL, unitQuantity real);
  CREATE TABLE box_product(
    boxId integer NOT NULL REFERENCES box(id),
    productId integer NOT NULL REFERENCES product(id),
    quantity real NOT NULL,
    PRIMARY KEY(boxId, productId)
  );

  CREATE TABLE "order"(
    id serial primary key NOT NULL, 
    customerId integer NOT NULL REFERENCES customer(id)
  );

  CREATE TABLE order_box(
    orderId integer NOT NULL REFERENCES "order"(id),
    boxId integer NOT NULL REFERENCES box(id),
    quantity integer NOT NULL,
    PRIMARY KEY(orderId, boxId)
  );

  CREATE TABLE order_product(
    orderId integer NOT NULL REFERENCES "order"(id),
    productId integer NOT NULL REFERENCES product(id),
    quantity real NOT NULL,
    PRIMARY KEY(orderId, productId)
  );

  -- GRANT ALL ON ALL TABLES IN SCHEMA public TO openvegbox;
  -- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO openvegbox;
END $$
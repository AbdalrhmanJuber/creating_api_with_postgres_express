'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.runSql(`
    CREATE TABLE orderitem (
      id SERIAL PRIMARY KEY,
      quantity INTEGER NOT NULL,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      CONSTRAINT fk_order
        FOREIGN KEY(order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,
      CONSTRAINT fk_product
        FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
    );
  `);
};

exports.down = function (db) {
  return db.runSql('DROP TABLE orderitem;');
};

exports._meta = {
  "version": 1
};

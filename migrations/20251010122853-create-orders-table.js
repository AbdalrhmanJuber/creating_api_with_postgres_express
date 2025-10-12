"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.runSql(`
    CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(255),
    user_id INTEGER,
    CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
`);
};

exports.down = function (db) {
  return db.runSql(`DROP TABLE orders`);
};

exports._meta = {
  version: 1,
};

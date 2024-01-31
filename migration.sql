DROP TABLE IF EXISTS round;
DROP TABLE IF EXISTS caliber;

CREATE TABLE caliber (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE round (
  id SERIAL PRIMARY KEY,
  name TEXT,
  dmg INTEGER,
  caliber_id INTEGER REFERENCES caliber(id) ON DELETE CASCADE,
  penetration INTEGER
);

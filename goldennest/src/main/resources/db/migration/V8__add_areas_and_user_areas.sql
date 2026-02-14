-- V8_add_areas_and_user_areas.sql

CREATE TABLE areas (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE user_areas (
  user_id BIGINT NOT NULL,
  area_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, area_id),
  CONSTRAINT fk_user_areas_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_user_areas_area
    FOREIGN KEY (area_id) REFERENCES areas(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

ALTER TABLE property
  ADD COLUMN area_id BIGINT NULL;

ALTER TABLE property
  ADD CONSTRAINT fk_property_area
    FOREIGN KEY (area_id) REFERENCES areas(id);

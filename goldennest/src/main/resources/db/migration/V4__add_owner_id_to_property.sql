ALTER TABLE property
    ADD COLUMN owner_id BIGINT NULL,
    ADD CONSTRAINT fk_property_owner
        FOREIGN KEY (owner_id) REFERENCES users(id);

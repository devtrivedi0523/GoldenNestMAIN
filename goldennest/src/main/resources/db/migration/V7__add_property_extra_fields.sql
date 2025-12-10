-- V7__add_property_extra_fields.sql

ALTER TABLE property
    ADD COLUMN tenure             VARCHAR(100) NULL,
    ADD COLUMN lease_start_date   DATE NULL,
    ADD COLUMN lease_term_years   INT NULL,
    ADD COLUMN lease_expiry_date  DATE NULL,
    ADD COLUMN virtual_tours      TEXT NULL;
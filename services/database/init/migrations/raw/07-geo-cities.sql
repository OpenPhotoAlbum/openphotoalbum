CREATE TABLE `geo_cities` (
    `id` int(255) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `postal_code` VARCHAR(255) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `state_code` varchar(2) not null default '',
    `county_name` VARCHAR(255),
    `county_names_all` VARCHAR(255),
    `timezone` VARCHAR(255),
    `multi` INT(1) not null default 0,
    CONSTRAINT `geo_cities_state_code_foreign` FOREIGN KEY (`state_code`) REFERENCES `geo_states` (`code`) ON DELETE CASCADE
);

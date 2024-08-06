USE metro;

CREATE TABLE
    wallets (
        address CHAR(10) NOT NULL,
        pkeyhash CHAR(64) DEFAULT NULL,
        balance BIGINT UNSIGNED NOT NULL DEFAULT 0,
        firstSeen DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        totalin BIGINT UNSIGNED NOT NULL DEFAULT 0,
        totalout BIGINT UNSIGNED NOT NULL DEFAULT 0,
        locked BOOLEAN NOT NULL DEFAULT FALSE,
        flare VARCHAR(24) DEFAULT NULL,
        PRIMARY KEY (address)
    );

CREATE TABLE
    transactions (
        uuid CHAR(36) NOT NULL,
        amount BIGINT UNSIGNED NOT NULL,
        wallet_to CHAR(10) NOT NULL,
        wallet_from CHAR(10) NOT NULL,
        timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        metaname VARCHAR(24) DEFAULT NULL,
        name VARCHAR (24) DEFAULT NULL,
        type ENUM('transfer', 'name_purchase', 'name_transfer', 'tax') NOT NULL,
        metadata VARCHAR(512) DEFAULT NULL,
        PRIMARY KEY (uuid),
        state ENUM('completed', 'pending', 'reverted', 'held') NOT NULL DEFAULT 'pending',
    );

CREATE TABLE
    authlogs (
        address CHAR(10) NOT NULL,
        ip VARCHAR(16) NOT NULL,
        timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        useragent TEXT NOT NULL
    );

CREATE TABLE
    names (
        address VARCHAR(24) NOT NULL,
        owner CHAR(10) NOT NULL,
        original_owner CHAR(10) NOT NULL,
        registered DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        transferred DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        PRIMARY KEY (address)
    );


CREATE TABLE
    namehistory (
        id CHAR(36) NOT NULL,
        address VARCHAR(24) NOT NULL,
        wallet_to CHAR(10) NOT NULL,
        wallet_from char(10) DEFAULT NULL,
        timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        type ENUM('transfer', 'purchase'),
        PRIMARY KEY (id)
    );
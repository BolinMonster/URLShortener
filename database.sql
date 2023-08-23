-------------------------------------------------------
-- DRIVER : POSTGRESQL
-------------------------------------------------------
-- script database.sql
-- connect to database : psql
-- create database named url_shortener : CREATE DATABASE url_shortener;
-- connect to database : \c url_shortener
-- execute the script : \i database.sql
-- verification : \dt
-------------------------------------------------------
DROP TABLE IF EXISTS "urls" CASCADE;

-------------------------------------------------------
-- TABLE urls
-------------------------------------------------------
-- id : identifiant url
-- createdAt : creation date
-- updateAt : update date
-- url : url saved (www.exemple.com)
-- key : key matching with this url (H4D087Fx50e)
-------------------------------------------------------

CREATE TABLE "urls" (
	"id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
	"createdAt" TIMESTAMP DEFAULT NOW(),
	"updatedAt" TIMESTAMP,
	"url" VARCHAR(512),
	"key" VARCHAR(512)
);
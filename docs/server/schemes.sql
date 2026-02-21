CREATE TABLE jetons(
   id INT NOT NULL AUTO_INCREMENT,
   rafrachissement BINARY(64) NOT NULL,
   hash_ip CHAR(60) NOT NULL,
   PRIMARY KEY(id)
);

CREATE TABLE comptes(
   jetons_id INT,
   id INT NOT NULL AUTO_INCREMENT,
   email VARCHAR(64) NOT NULL,
   clef_pub_mdp BINARY(32),
   creation DATETIME,
   connexion DATE,
   PRIMARY KEY(id),
   UNIQUE(email),
   FOREIGN KEY(jetons_id) REFERENCES jetons(id)
);

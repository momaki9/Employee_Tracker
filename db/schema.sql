DROP DATABASE IF EXISTS registrar_db;
CREATE DATABASE registrar_db;

USE registrar_db;

CREATE TABLE department (
  -- this id needs to be a primary that links to department_id in roles
  id INT NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  -- this id needs to be primary to link with employee table
  ID INT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  --foreign key connected to to department id
  department_id INT NOT NULL,
  PRIMARY KEY (ID),
  FOREIGN KEY(department_id)
  REFERENCES department(id)
  ON DELETE SET NULL
);

CREATE TABLE employee (
  id INT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  -- foreign key coming from roles table
  role_id INT NOT NULL,
  -- ? manager id needs to be linked somehow to employee id based on role
  manager_id INT NOT NULL,
  FOREIGN KEY (role_id)
  REFERENCES roles(ID)
  ON DELETE SET NULL
);

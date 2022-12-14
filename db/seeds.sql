-- insert the following department names into the department table
INSERT INTO department (department_name) 
VALUES ("Chemistry"),
       ("Programming"),
       ("Engineering"),
       ("Content");
-- insert the following roles into the roles table
INSERT INTO roles (title, salary, department_id)
VALUES ("QC Chemist", '80000', 1),
       ("Item Programmer", '80000', 2),
       ("Software Engineer", '120000', 3),
       ("Content Writer", '150000', 4);
-- insert the following employees into the employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ronaldo", "Nazario", 1, 6),
       ("Bruce", "Lee", 1, 6),
       ("John", "Chester", 2, 5),
       ("Jessie", "Ice", 2, 5),
       ("Vivianne", "Miedema", 3, 6),
       ("JC", "Williams", 4, null);
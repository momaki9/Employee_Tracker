INSERT INTO department (department_name) 
VALUES ("Chemistry"),
       ("Programming"),
       ("Engineering"),
       ("Content");
-- Look at folder 20 solved values for primary and foreign keys need to be added--
INSERT INTO roles (title, salary, department_id)
VALUES ("QC Chemist", '80000', 1),
       ("Item Programmer", '80000', 2),
       ("Software Engineer", '120000', 3),
       ("Content Writer", '150000', 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mostafa", "Maki", 1, 6),
       ("Christopher", "Lee", 1, 6),
       ("John", "Chester", 2, 5),
       ("Jurgin", "Galicia", 2, 5),
       ("Casey", "Prolux", 3, 6),
       ("Chris", "Grayce", 4, null);
INSERT INTO department (id, department_name) 
VALUES (3, "ChemQC"),
       (4, "PRG"),
       (2, "SofEng"),
       (1, "Content");
-- Look at folder 20 solved values for primary and foreign keys need to be added--
INSERT INTO roles (id, title, salary, department_id)
VALUES (1, "QC Chemist", '80000', 3),
       (2, "Item Programmer", '80000', 4),
       (3, "Software Engineer", '120000', 2),
       (4, "Content Writer", '150000', 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (219, "Mostafa", "Maki", 1, 19),
       (220, "Christopher", "Lee", 1, 19),
       (233, "John", "Chester", 2, 33),
       (203, "Jurgin", "Galicia", 2, 33),
       (33, "Casey", "Prolux", 3, 19),
       (19, "Chris", "Grayce", 4, 11);
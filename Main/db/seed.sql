INSERT INTO department (id, name) 
VALUES 	(1, 'Engineering'),
		(2, 'Human Resources'),
		(3, 'Research & Development');

INSERT INTO roles (id, title, salary, department_id)
VALUES  (1, "Engineer", 120000, 1),
		(2, "Accounting", 80000, 2),
		(3, "Chief Engineer", 150000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  (1, "Jerry", "Shaw", 1, null),
		(2, "Vincent", "Chase", 2, 1),
		(3, "Ricky", "Jerret", 3, 1);
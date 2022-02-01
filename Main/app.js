const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
//const logo = require('asciiart-logo');

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Prompt for main menu
function menuPrompt() {
    return inquirer.prompt(
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'],
        },
    )
        .then((reponses) => {
            if (reponses.menu === 'View All Employees') {
                return viewEmployees();
            } else if (reponses.menu === 'View All Roles') {
                return viewRoles();
            } else if (reponses.menu === 'View All Departments') {
                return viewDepartments();
            } else if (reponses.menu === 'Add Department') {
                return addDepartment();
            } else if (reponses.menu === 'Add Role') {
                return addRole();
            } else if (reponses.menu === 'Add Employee') {
                return addEmployee();
            } else if (reponses.menu === 'Update Employee Role') {
                return updateRole();
            } else {
                return
            }
        }
        )
};

menuPrompt();

function viewEmployees() {
    connection.query(
        'SELECT first_name, last_name, title, salary, manager_id, name  FROM employee INNER JOIN roles ON employee.role_id = roles.id INNER JOIN department ON roles.department_id = department.id',
        //employee_id, first_name FROM employee INNER JOIN department = employee.id',
        function (err, results) {
            console.table(results);
            menuPrompt();
        }
    )
}

function viewRoles() {
    connection.query(
        'SELECT * FROM roles',
        function (err, results) {
            console.table(results);
            menuPrompt();
        }
    )
}

function viewDepartments() {
    connection.query(
        'SELECT * FROM department',
        function (err, results) {
            console.table(results);
            menuPrompt();
        }
    )
}

function addDepartment() {
    return inquirer.prompt(
        [
            {
                type: 'input',
                name: 'departmentName',
                message: 'What is the name of the department?',
            },
        ])
        .then((responses) => {
            connection.query(
                `INSERT INTO department (name) VALUES ("${responses.departmentName}")`,
                function (err, results) {
                    console.log("Added new department to database.");
                    menuPrompt();
                }
            )
        })
}

function addRole() {
    connection.query(
        `SELECT * FROM department`,
        function (err, departments) {

            return inquirer.prompt(
                [
                    {
                        type: 'input',
                        name: 'roleName',
                        message: 'What is the name of the role?',
                    },
                    {
                        type: 'input',
                        name: 'roleSalary',
                        message: 'What is the salary of the role?',
                    },
                    {
                        type: 'list',
                        name: 'roleDepartment',
                        message: 'Which department does the role belong to?',
                        choices: departments.map(function (department) {
                            return department.name;
                        })
                    },
                ])
                .then((responses) => {
                    let departmentId
                    for (i = 0; i < departments.length; i++) {
                        if (departments[i].name === responses.roleDepartment) {
                            departmentId = departments[i].id
                        }
                    }
                    connection.query(
                        `INSERT INTO roles (title, salary, department_id) VALUES ("${responses.roleName}", "${responses.roleSalary}", "${departmentId}")`,
                        function (err, results) {
                            console.log("Added new role to database.");
                            menuPrompt();
                        }
                    )
                })
        }
    )
}

function addEmployee() {
    connection.query(
        `SELECT * FROM employee`,
        function (err, employees) {
            // console.log(err)
            // console.log(employees);
            connection.query(
                `SELECT * FROM department`,
                function (err, departments) {
                    // console.log(err);
                    // console.log(departments)
                    return inquirer.prompt(
                        [
                            {
                                type: 'input',
                                name: 'firstName',
                                message: 'What is the employees first name?',
                            },
                            {
                                type: 'input',
                                name: 'lastName',
                                message: 'What is the employees last name?',
                            },
                            {
                                type: 'list',
                                name: 'employeeRole',
                                message: 'What is the employees role?',
                                choices: departments.map(function (department) {
                                    return department.name;
                                })
                            },
                            {
                                type: 'list',
                                name: 'employeeManager',
                                message: 'Who is the employees manager?',
                                choices: employees.map(function (employee) {
                                    return employee.first_name;
                                })
                            }
                        ])
                        .then((responses) => {
                            let departmentId
                            for (i = 0; i < departments.length; i++) {
                                if (departments[i].name === responses.employeeRole) {
                                    departmentId = departments[i].id
                                }
                            }
                            let managerId
                            for (i = 0; i < employees.length; i++) {
                                if (employees[i].first_name === responses.employeeManager) {
                                    managerId = employees[i].id
                                }
                            }
                            connection.query(
                                `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${responses.firstName}", "${responses.lastName}", "${departmentId}", "${managerId}")`,
                                function (err, results) {
                                    console.log(err)
                                    console.log("Added new employee to database.");
                                    menuPrompt();
                                }
                            )
                        })
                }
            )
        }
    )

}

function updateRole() {
    connection.query(
        `SELECT * FROM employee`,
        function (err, employees) {
            connection.query(
                `SELECT * FROM roles`,
                function (err, role) {
                    return inquirer.prompt(
                        [
                            {
                                type: 'list',
                                name: 'updateEmployee',
                                message: 'Which employees role would you like to update?',
                                choices: employees.map(function (employee) {
                                    return employee.first_name;
                                })
                            },
                            {
                                type: 'list',
                                name: 'assignRole',
                                message: 'Which role would you like to assign to the employee?',
                                choices: role.map(function (roles) {
                                    return roles.title;
                                })
                            }
                        ])
                        .then((responses) => {
                            let employeeId
                            for (i = 0; i < employees.length; i++) {
                                if (employees[i].first_name === responses.updateEmployee) {
                                    employeeId = employees[i].id
                                }
                            }
                            let roleId
                            for (i = 0; i < role.length; i++) {
                                if (role[i].title === responses.assignRole) {
                                    roleId = role[i].id
                                }
                            }
                            connection.query(
                                `UPDATE employee SET role_id = ? WHERE id = ?`, [roleId, employeeId],
                                function (err, results) {
                                    console.log("Updated employee role in database.");
                                    menuPrompt();
                                }
                            )
                        })
                }
            )
        }
    )

}
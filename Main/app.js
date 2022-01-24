const inquirer = require('inquirer');
const mysql = require('mysql2');
const connection = require('./db/connection');
//const logo = require('asciiart-logo');

const PORT = process.env.PORT || 3001;

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
            } else if (reponses.menu === 'Add Employee') {
                return;
            } else {
                
            }
        }
    )
};

menuPrompt();

function viewEmployees() {
    connection.query(
        'SELECT * FROM employee', 
        function(err, results) {
            console.log(results);
        }
    )
}
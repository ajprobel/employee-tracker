const inquirer = require("inquirer");
const dbQuery = require("./lib/queries/queries.js");
const cTable = require('console.table');

// Defining start function - will run on 'npm start' or 'node index.js'
const start = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                loop: true,
                message: 'Which action would you like to do?',
                choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role'],
                name: 'option',
            }
        ])
        .then((response) => {
            const { option } = response;
            // based on what the user has chosen from Inquirer, call the related method of the imported object
            switch (option) {
                case 'view all departments':
                    console.log("List of Departments:");
                    dbQuery.viewDepartments();
                    break;
                case "view all roles":
                    console.log("List of Roles:");
                    dbQuery.viewRoles();
                    break;
                case "view all employees":
                    console.log("List of Employees:");
                    dbQuery.viewEmployees();
                    break;
                case "add a department":                    
                    dbQuery.addDepartment();
                    break;
                case "add a role":
                    dbQuery.addRole();
                    break;
                case "add an employee":
                    dbQuery.addEmployee();
                    break;
                case "update an employee role":
                    dbQuery.updateEmployee();
                    break;
            };
            
        })
};

start();

const inquirer = require("inquirer");
const dbQuery = require("./lib/queries/queries.js");

const start = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which action would you like to do?',
                choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role'],
                name: 'option',
            }
        ])
        .then((response) => {
            const { option } = response;
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
            // start();
        })
};

start();

// const test = () => {
//     dbQuery.viewRoles();
// }

// test();
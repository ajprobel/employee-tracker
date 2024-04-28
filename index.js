const inquirer = require("inquirer");
const dbQuery = require("./lib/queries/queries.js")

const start = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which action would you like to do?',
                choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role'],
                name: 'start',
            }
        ])
        .then((response) => {
            switch (response) {
                case "view all departments":
                    dbQuery.viewDepartments();
                    break;
                case "view all roles":
                    dbQuery.viewRoles();
                    break;
                case "view all employees":
                    dbQuery.viewEmployees();
                    break;
                case "add a department":
                    // query to add department
                    console.log(1);
                    break;
                case "add a role":
                    console.log(1);
                    break;
                case "add an employee":
                    console.log(1);
                    break;
                case "update an employee role":
                    console.log(1);
                    break;
            }
        })
};

// start();

// const test = () => {
//     dbQuery.viewRoles();
// }

// test();
const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection({
    user: 'root',
    password: '',
    host: '127.0.0.1',
    port: 3306,
    database: 'organization_db'
});

const Query = () => { }

// Query to view the "departments" table
Query.viewDepartments = () => {
    db.query("SELECT * FROM department;", (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log(res);
        // return res;
    })
}

// Query to view the "roles" table
Query.viewRoles = () => {
    db.query("SELECT * FROM role;", (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log(res);
    })
}

// Query to view the "employees" table
Query.viewEmployees = () => {
    db.query("SELECT * FROM employee;", (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log(res);
    })
}

// Query to add a department
Query.addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Please enter the name of the new department',
                name: 'newDepartment',
            }
        ])
        .then((response) => {
            const { newDepartment } = response;
            db.query(`INSERT INTO department (name) VALUES ("${newDepartment}");`, (err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log(res);
            });
            console.log("Updated Department List!");
            Query.viewDepartments();
        })
    
}

// Query to add a role
Query.addRole = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Please enter the name of the new role',
                name: 'newRole',
            },
            {
                type: 'input',
                message: 'Please enter the salary in USD of the new role',
                name: 'salary',
            },
            {
                type: 'list',
                message: 'Which action would you like to do?',
                choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role'],
                name: 'department',
            }
        ])
        .then((response) => {
            const { newRole, salary, department } = response;
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${newRole}");`, (err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log(res);
            })
        })
    
}

// Query to add an employee
Query.addEmployee = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Please enter the name of the new role',
                name: 'newEmployee',
            }
        ])
        .then((response) => {
            const { newEmployee } = response;
            db.query(`INSERT INTO employee VALUES ("${newEmployee}");`, (err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log(res);
            })
        })
    
}

Query.updateEmployee = () => {
    db.query("SELECT * FROM employee;", (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log(res);
    })
}

module.exports = Query;
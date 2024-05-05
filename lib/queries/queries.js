const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require('console.table');

const db = mysql.createConnection({
    user: 'root',
    password: '',
    host: '127.0.0.1',
    port: 3306,
    database: 'organization_db'
});

// Defining the same start code so we can call it as the last step in each object method below
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
            switch (option) {
                case 'view all departments':
                    console.log("List of Departments:");
                    Query.viewDepartments();
                    break;
                case "view all roles":
                    console.log("List of Roles:");
                    Query.viewRoles();
                    break;
                case "view all employees":
                    console.log("List of Employees:");
                    Query.viewEmployees();
                    break;
                case "add a department":
                    Query.addDepartment();
                    break;
                case "add a role":
                    Query.addRole();
                    break;
                case "add an employee":
                    Query.addEmployee();
                    break;
                case "update an employee role":
                    Query.updateEmployee();
                    break;
            };

        })
};

const Query = () => { }

// Query to view the "departments" table
Query.viewDepartments = () => {
    db.query("SELECT * FROM department;", async (err, res) => {
        if (err) {
            console.log(err);
        }
        await console.table(res);
        await start();
    })
}

// Query to view the "roles" table
Query.viewRoles = () => {
    db.query("SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id=department.id;", async (err, res) => {
        if (err) {
            console.log(err);
        }
        await console.table(res);
        await start();
    })
}

// Query to view the "employees" table
Query.viewEmployees = () => {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, role.salary, employee.manager_id FROM employee JOIN role ON employee.role_id=role.id;", async (err, res) => {
        if (err) {
            console.log(err);
        }
        await console.table(res);
        await start();
    })
}

// Query to add a department - asks user to input new department name
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
            db.query(`INSERT INTO department (name) VALUES ("${newDepartment}");`, async (err, res) => {
                if (err) {
                    console.log(err);
                }
                await console.log("Updated Department List!\n");
                await start();
            });

        })

}

// Query to add a role - 
Query.addRole = () => {
    // get data from existing department table to use in inquirer
    db.query(`SELECT name FROM department;`, (err, res) => {
        if (err) {
            console.log(err);
        }

        // Here we take the returned object from the query and turn it into an array using array.map()
        // Now we can use that for inquirer
        const currentDepartmentsObj = res;
        const currentDepartmentsArr = currentDepartmentsObj.map(({ name: department }) => department);

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
                    message: 'Which department does this role belong to?',
                    choices: currentDepartmentsArr,
                    name: 'department',
                }
            ])
            .then((response) => {
                // destructuring response
                const { newRole, salary, department } = response;
                // turning the department string back into an int for the id
                // find which index of the current departments matches the users' choice, then + 1 to match database's department id
                let departmentNo = 0
                for (let i = 0; i < currentDepartmentsArr.length; i++) {
                    if (department === currentDepartmentsArr[i]) {
                        departmentNo = (i + 1);
                        break;
                    };
                };
                db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${newRole}", "${salary}", "${departmentNo}");`, async (err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    await console.log("New Role Added!\n");
                    await start();
                })

            })
    });


}

// Query to add an employee
Query.addEmployee = () => {
    //getting all the current managers
    db.query(`SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL`, (err, res) => {
        if (err) {
            console.log(err);
        }

        // transforming the resulting object into an array we can use for inquirer
        const managersObj = res;
        const managersArr = managersObj.map(({ id: idNum, first_name: first, last_name: last }) => `${first} ${last}`);
        const managerIDs = managersObj.map(({ id: idNum, first_name: first, last_name: last }) => idNum);
        managersArr.push("No Manager");

        // getting all the current roles
        db.query(`SELECT id, title FROM role;`, (err, res) => {
            if (err) {
                console.log(err);
            }

            // transforming the resulting object into an array we can use for inquirer
            const rolesObj = res;
            const rolesArr = rolesObj.map(({ id: idNum, title: role }) => role);
            const rolesIDs = rolesObj.map(({ id: idNum, title: role }) => idNum);
            inquirer
                .prompt([
                    {
                        type: 'input',
                        message: `Enter the new employee's first name:`,
                        name: 'newFirstName',
                    },
                    {
                        type: 'input',
                        message: `Enter the new employee's last name:`,
                        name: 'newLastName',
                    },
                    {
                        type: 'list',
                        message: 'Which role will this new employee have?',
                        choices: rolesArr,
                        name: 'role',
                    },
                    {
                        type: 'list',
                        message: 'Please select which manager this new employee will report to:',
                        choices: managersArr,
                        name: 'manager',
                    }

                ])
                .then((response) => {
                    const { newFirstName, newLastName, role, manager } = response;

                    // turn the user's selected role back into an integer (id) to store in database
                    let roleID = 0;
                    for (let i = 0; i < rolesArr.length; i++) {
                        if (role === rolesArr[i]) {
                            indexNo = (i);
                            roleID = rolesIDs[indexNo];
                            break;
                        }
                    };

                    // turn the user's selected manager back into an integer (id) to store in database
                    let managerID = 0;
                    if (manager == "No Manager") {
                        // if no manager, enter null into database
                        managerID = null;
                    }
                    for (let i = 0; i < managersArr.length; i++) {
                        // once the user's selected manager matches an index of all the possible managers, it then takes that index to select the manager's ID number
                        if (manager === managersArr[i]) {
                            indexNo = (i);
                            managerID = managerIDs[indexNo];
                            break;
                        }
                    };

                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${newFirstName}", "${newLastName}", "${roleID}", "${managerID}" );`, async (err, res) => {
                        if (err) {
                            console.log(err);
                        }
                        await console.log("New Employee Added!\n");
                        await start();
                    })

                })
        })
    })
}

Query.updateEmployee = () => {
    db.query("SELECT id, first_name, last_name FROM employee;", (err, res) => {
        if (err) {
            console.log(err);
        }
        const employeeObj = res;
        const employeeArr = employeeObj.map(({ id: idNum, first_name: first, last_name: last }) => `${first} ${last}`);
        const employeeIDs = employeeObj.map(({ id: idNum, first_name: first, last_name: last }) => idNum);
        db.query(`SELECT id, title FROM role;`, (err, res) => {
            if (err) {
                console.log(err);
            }

            // transforming the resulting object into an array we can use for inquirer
            const rolesObj = res;
            const rolesArr = rolesObj.map(({ id: idNum, title: role }) => role);
            const rolesIDs = rolesObj.map(({ id: idNum, title: role }) => idNum);
            inquirer
                .prompt([
                    {
                        type: 'list',
                        message: 'Which employee would you like to update?',
                        choices: employeeArr,
                        name: 'employee',
                    },
                    {
                        type: 'list',
                        message: 'Please select which manager this new employee will report to:',
                        choices: rolesArr,
                        name: 'newRole',
                    }

                ])
                .then((response) => {
                    const { employee, newRole } = response;

                    let employeeID = 0;
                    for (let i = 0; i < employeeArr.length; i++) {
                        if (employee === employeeArr[i]) {
                            indexNo = (i);
                            employeeID = employeeIDs[indexNo];
                        }
                    };


                    let newRoleID = 0;
                    for (let i = 0; i < rolesArr.length; i++) {
                        if (newRole === rolesArr[i]) {
                            indexNo = (i);
                            newRoleID = rolesIDs[indexNo];
                            break;
                        }
                    };

                    // Query to update employee
                    db.query(`UPDATE employee SET role_id = ${newRoleID} WHERE id = ${employeeID}`, async (err, res) => {
                        if (err) {
                            console.log(err);
                        }
                        await console.log("Employee Updated!\n");
                        await start();
                    })
                })
        })
    })
}

module.exports = Query;
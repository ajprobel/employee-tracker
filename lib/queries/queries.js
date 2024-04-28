const mysql = require("mysql2");

const db = mysql.createConnection({
    user: 'root',
    password: '550624Mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'organization_db'
});

const Query = () => {}

Query.viewDepartments = () => {
    db.query("SELECT * FROM department;", (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log(res);
    })
}

Query.viewRoles = () => {
    db.query("SELECT * FROM role;", (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log(res);
    })
}

Query.viewEmployees = () => {
    db.query("SELECT * FROM employee;", (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log(res);
    })
}

module.exports = Query;
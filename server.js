// =====================================================================================================================
// =====================================\ Employee Tracker - Homework 12 /==============================================
// =====================================================================================================================

// Require npm
const mysql = require('mysql2/promise')
const inquirer = require('inquirer');
const consoleT = require('console.table');

// Connection var
let connnection

// inquirer menu
const view_employees = "View employees";
const view_departments = "View departments";
const view_roles = "View roles";
const add_department = "Add department";
const add_role = "Add role";
const add_employee = "Add employee";
const update_employee_role = "Update employee role";
const exit = "Exit";

// Principal Function to trigger the application
main()

// ------------------------------\ Setup /------------------------------------
async function main () {
  try {
    await connect()
    await userMenu()
  } catch (err) {
    console.error(err)
  } finally {
    connection.end()
  }
}
async function connect () {
  connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',   // ================ Remember to add your PASSWORD here!
    database: 'employees_db'
  })
  console.log('Connected to MySQL as id: ' + connection.threadId)
}

// ------------------------------\ Prompt Menu /----------------------------------
async function userMenu() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            view_employees,
            view_departments,
            view_roles,
            add_department,
            add_role,
            add_employee,
            update_employee_role,
            exit
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case view_employees:
                viewEmployees();
                break;
            case view_departments:
                viewDepartments();
                break;
            case view_roles:
                viewRoles();
                break;    
            case add_department:
                addDepartment();
                break;
            case add_role:
                addRole();
                break;
            case add_employee:
                addEmployee();
                break;
            case update_employee_role:
                updateEmployeeRole();
                break;
            case exit:
                console.log("Employee Tracker has ended");
                connection.end();
                break;
        };
    });
};



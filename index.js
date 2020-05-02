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
const view_employees = "View Employees";
const view_departments = "View Departments";
const view_roles = "View Roles";
const add_department = "Add Department";
const add_role = "Add Role";
const add_employee = "Add Employee";
const update_employee_role = "Update Employee Role";
const exit = "Exit";

// ini Arrays to display updated choices 
const nameList = [];
const rolesList = [];
const departmentsList = [];

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
    await inquirer.prompt({
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
    }).then(async function (answer) {
        switch (answer.action) {
            case view_employees:
                await viewEmployees();
                break;
            case view_departments:
                await viewDepartments();
                break;
            case view_roles:
                await viewRoles();
                break;
            case add_employee:
                await addEmployee();
                break;        
            case add_department:
                await addDepartment();
                break;
            case add_role:
                await addRole();
                break;
            case update_employee_role:
                await updateEmployeeRole();
                break;
            case exit:
                console.log("Employee Tracker has ended");
                connection.end();
                break;
        };
    });
};

// ------------------------------------------------\ Async Functions /---------------------------------------------------

// ----------\ VIEW /------------
// Display updated Employees list
async function viewEmployees () {
    const [rows] = await connection.query('SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e INNER JOIN role ON e.role_id = role.id  INNER JOIN department ON role.department_id = department.id LEFT JOIN employee m ON m.id = e.manager_id')
    console.table(rows)
    await userMenu();
}
// Display updated Departments list
async function viewDepartments() {
    const [rows] = await connection.query('SELECT * FROM department')
    console.table(rows)
    await userMenu();
};
// Display updated Roles list
async function viewRoles() {
    const [rows] = await connection.query('SELECT role.id, title, salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id')
    console.table(rows)
    await userMenu();
};

// ------------\ ADD /--------------
// creates new Employee into the db
async function addEmployee() {
    
    await inquirer.prompt([{
        message: 'Enter Name:',
        name: 'firstName'
      },
      {
        message: 'Enter Last Name:',
        name: 'lastName'
      },
      {
        type: 'list',  
        message: 'Select a Role',
        name: 'role',
        choices: await rolesGenerator()
      },
      {
        type: 'list',  
        message: 'Who is the Manager',
        name: 'manager',
        choices: await namesGenerator()
      }
    ]).then(async function ({ firstName, lastName, role, manager }) {

        const [rows] = await connection.query('INSERT INTO employee SET ?', {
            first_name: firstName,
            last_name: lastName,
            role_id: await getRoleId(role),
            manager_id: await getEmployeeId(manager)
        })
        console.log(`succed, new employee: ${firstName} ${lastName}, added`)
        await userMenu()
    })

}
// creates new Department into the db
async function addDepartment() {
    await inquirer.prompt(
        {
            name: "department",
            type: "input",
            message: "What department would you like to add?"
        }

    ).then(async function ({ department }) {
        const [rows] = await connection.query('INSERT INTO department SET ?',{
                name: department
            })
        console.log(`Succed, new department: ${department}, added`)
        await userMenu()
    })
}

// creates new Role into the db
async function addRole() {
    
    await inquirer.prompt([{
        message: 'Enter Title:',
        name: 'title'
      },
      {
        message: 'Enter Salary:',
        name: 'salary'
      },
      {
        type: 'list',  
        message: 'Choose Department',
        name: 'department',
        choices: await departmentGenerator()
      }
    ]).then(async function ({ title, salary, department }) {

        const [rows] = await connection.query('INSERT INTO role SET ?', {
            title: title,
            salary: salary,
            department_id: await getDepartmentId(department)
        })
        console.log(`succed, new Role: ${title}, added`)
        await userMenu()
    })

}


// ------------\ UPDATE /--------------
async function updateEmployeeRole() {
    await inquirer.prompt([{
        type: 'list',  
        message: 'Choose Employee',
        name: 'name',
        choices: await namesGenerator()
      },
      {
        type: 'list',  
        message: 'Choose New Role',
        name: 'role',
        choices: await rolesGenerator()
      }
    ]).then(async function ({ name, role }) {
        const [rows] = await connection.query('UPDATE employee SET ? WHERE ?',[
            {role_id: await getRoleId(role)},
            {id: await getEmployeeId(name)}
        ])

        console.log(`succed, Employee: ${name}, updated`)
        await userMenu()
    })
}

//------------------------------------\ Database /-----------------------------------
// NAMES
async function namesGenerator() {
    const [names] = await connection.query('SELECT first_name, last_name FROM employee')
    
    names.forEach(employeeName => {
        const fullName = employeeName.first_name + ' ' + employeeName.last_name
        nameList.push(fullName)
    });
    // console.log(nameList) // =========== Names List Check
    return nameList
}

// ROLES
async function rolesGenerator() {
    const [roles] = await connection.query('SELECT title FROM role')
    
    // Convert obj to arr
    roles.forEach(role => {
        rolesList.push(role.title)
    });
    // console.log(rolesList) // =========== Roles List Check
    return rolesList
}

// DEPARTMENTS
async function departmentGenerator() {
    const [departments] = await connection.query('SELECT name FROM department')
    
    // Convert obj to arr
    departments.forEach(department => {
        departmentsList.push(department.name)
    });
    // console.log(departmentsList) // =========== Departments List Check
    return departmentsList
}
// ----------------------- \ convert to ID / ----------------------------
// Department
async function getDepartmentId (department){
    const [dpasID] = await connection.query('SELECT id, name FROM department')
    
    const dpasList = dpasID.find(dpa => {
        return dpa.name == department
    })
    // console.log(dpasList)
    return dpasList.id
}

// Employee
async function getEmployeeId(manager){
    const [emplsID] = await connection.query('SELECT id, first_name, last_name FROM employee')
    
    const emplsList = emplsID.find(empl => {
        return `${empl.first_name} ${empl.last_name}` == manager
    })
    // console.log(mngsList)
    return emplsList.id
}

// Role
async function getRoleId(role){
    const [rlsID] = await connection.query('SELECT id, title FROM role')
    
    const rlsList = rlsID.find(rl => {
        return rl.title == role
    })
    // console.log(rlsList)
    return rlsList.id
}

// =====================================================================================================================
// ====================================================\ END /==========================================================
// =====================================================================================================================
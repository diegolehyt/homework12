
//------------------------------------\ Database /-----------------------------------
// ini Arrays to display updated choices 
const nameList = [];
const rolesList = [];
const departmentsList = [];

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

module.exports = {
  namesGenerator: namesGenerator,
  rolesGenerator: rolesGenerator,
  departmentGenerator: departmentGenerator,
};
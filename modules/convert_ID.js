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



module.exports = {
getDepartmentId: getDepartmentId,
getRoleId: getRoleId,
getEmployeeId: getEmployeeId,
};
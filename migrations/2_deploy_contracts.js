// eslint-disable-next-line no-undef
const Admin = artifacts.require("Admin");
// eslint-disable-next-line no-undef
const Skills = artifacts.require("Skills");
// eslint-disable-next-line no-undef
const Employee = artifacts.require("Employee");
module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Admin);
  const admin = await Admin.deployed();
  await deployer.deploy(Skills);
  const skills = await Skills.deployed();
  await deployer.deploy(Employee);
  const employee = await Employee.deployed();
  console.log(admin.address, skills.address, employee.address);
};

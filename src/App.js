import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Admin from "./abis/Admin.json"; // Adjust this path if necessary
import MetaMaskGuide from "./MetaMaskGuide";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AdminPageCreate from "./pages/Admin/CreateUser";
import AllEmployees from "./pages/Admin/AllEmployees";
import AllOrganizationEndorser from "./pages/Admin/AllOrganizationEndorser";
import EmployeePage from "./pages/Employee/Employee";
import UpdateProfile from "./pages/Employee/UpdateProfile";
import Organization from "./pages/OrganizationEndorser/Organization";
import EndorseSkill from "./pages/OrganizationEndorser/EndorseSkill";
import Endorse from "./pages/OrganizationEndorser/EndorseSection";
import Navbar from "./components/Navbar";
import GetEmployee from "./pages/GetRoutes/GetEmployee";
import GetOrg from "./pages/GetRoutes/GetOrg";
import NoRole from "./pages/NoRole/NoRole";
import Notifications from "./pages/NoRole/Notifications";
import NotificationsAdmin from "./pages/Admin/Notifications";
import NotificationsEmployee from "./pages/Employee/Notifications";
import NotificationsOrg from "./pages/OrganizationEndorser/Notifications";
import LoadComp from "./components/LoadComp";

function App() {
  const [isMeta, setIsMeta] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [account, setAccount] = useState("");
  const [isOrganizationEndorser, setIsOrganizationEndorser] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loadComp, setLoadComp] = useState(false);

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log("Accounts:", accounts);
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      toast.error("No accounts found!");
      return;
    }

    const networkId = await web3.eth.net.getId();
    console.log("Network ID:", networkId);
    const AdminData = Admin.networks[networkId];
    console.log("Admin Contract Data:", AdminData);
    if (AdminData) {
      const admin = new web3.eth.Contract(Admin.abi, AdminData.address);
      console.log("Admin Contract Instance:", admin);

      try {
        console.log("Calling isEmployee...");
        const isEmployee = await admin.methods.isEmployee(accounts[0]).call();
        console.log("isEmployee:", isEmployee);

        console.log("Calling isOrganizationEndorser...");
        const isOrganizationEndorser = await admin.methods.isOrganizationEndorser(accounts[0]).call();
        console.log("isOrganizationEndorser:", isOrganizationEndorser);

        console.log("Calling owner...");
        const owner = await admin.methods.owner().call();
        console.log("owner:", owner);

        setIsEmployee(isEmployee);
        setIsOrganizationEndorser(isOrganizationEndorser);
        setIsOwner(owner === accounts[0]);
      } catch (error) {
        console.error("Error calling contract methods:", error);
        toast.error("Error calling contract methods. See console for details.");
      }

    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
  };

  useEffect(() => {
    const func = async () => {
      setIsMeta(true);
      setLoadComp(true);
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        window.web3 = new Web3(window.ethereum);
        await loadBlockchainData();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        await loadBlockchainData();
      } else {
        setIsMeta(false);
      }
      setLoadComp(false);
    };
    func();
  }, []);

  const adminRoutes = () => (
    <Switch>
      <Route path="/" exact component={AllEmployees} />
      <Route path="/all-organization-endorser" exact component={AllOrganizationEndorser} />
      <Route path="/create-user" exact component={AdminPageCreate} />
      <Route path="/notifications" exact component={NotificationsAdmin} />
    </Switch>
  );

  const employeeRoutes = () => (
    <Switch>
      <Route path="/" exact component={EmployeePage} />
      <Route path="/update-profile" exact component={UpdateProfile} />
      <Route path="/notifications" exact component={NotificationsEmployee} />
    </Switch>
  );

  const organizationEndorserRoutes = () => (
    <Switch>
      <Route path="/" exact component={Organization} />
      <Route path="/endorse-skill" exact component={EndorseSkill} />
      <Route path="/endorse-section" exact component={Endorse} />
      <Route path="/notifications" exact component={NotificationsOrg} />
    </Switch>
  );

  const noRoleRoutes = () => (
    <Switch>
      <Route path="/" exact component={NoRole} />
      <Route path="/notifications" exact component={Notifications} />
    </Switch>
  );

  const renderRoutes = () => {
    if (isOwner) return adminRoutes();
    else if (isEmployee) return employeeRoutes();
    else if (isOrganizationEndorser) return organizationEndorserRoutes();
    else return noRoleRoutes();
  };

  return (
    <div>
      {loadComp ? (
        <LoadComp />
      ) : isMeta && account !== "" ? (
        <BrowserRouter>
          <Navbar />
          <ToastContainer />
          <Switch>
            <Route path="/getemployee/:employee_address" exact component={GetEmployee} />
            <Route path="/getOrg/:orgAddress" exact component={GetOrg} />
            {renderRoutes()}
          </Switch>
        </BrowserRouter>
      ) : (
        <MetaMaskGuide />
      )}
    </div>
  );
}

export default App;

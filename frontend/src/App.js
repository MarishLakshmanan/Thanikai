import Authentication from "./pages/Authentication";
import Home from "./pages/Home";
import Billing from "./pages/Billing";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedComponents from "./components/AuthorizationComponents/ProtectedComponents";
import VrpInfo from "./components/MainComponents/VrpInfo";
import ViewReport from "./components/MainComponents/ViewReport";
import IssueDetails from "./components/MainComponents/IssueDetails";
import Dashboard from "./components/MainComponents/Dashboard";
import BasicInformation from "./components/MainComponents/BasicInformation";
import ActionTaken from "./components/MainComponents/ActionTaken";
import PasswordReset from "./pages/PasswordReset";
import Contact from "./pages/Contact"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedComponents />}>
          <Route path="/" element={<Home />}>
            <Route path="/" element={<Dashboard />}/>
            <Route path="vrp-assist" element={<VrpInfo />} />
            <Route path="basic-information" element={<BasicInformation />} />
            <Route path="issue-details" element={<IssueDetails />} />
            <Route path="action-taken" element={<ActionTaken />} />
            <Route path="view" element={<ViewReport />} />
          </Route>
        </Route>
        <Route path="/auth" element={<Authentication />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/reset-password">
          <Route path=":id/:token" element={<PasswordReset/>} />
        </Route>
        <Route path="/contact" element={<Contact />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

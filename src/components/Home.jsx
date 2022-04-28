import React from "react";
import { Redirect } from "react-router-dom";
import Header from "./Header";
import "./Home.css";
import Dashboard from "./Dashboard";
import { Switch, Route } from "react-router-dom";
import EditUser from "../Pages/EditUser";

const Home = (props) => {
  // if (!props.loggedInStatus) {
  //   return <Redirect to="/" />;
  // } else {
  return (
    <></>
    // <div>
    //   <Header props={(props) => props} />
    //   {/* <Dashboard props={() => props} /> */}
    //   <Switch>
    //     <Route exact path={"/home"} render={(props) => <Dashboard />} />
    //     <Route exact path={"/edit-profile"} component={EditUser} />
    //   </Switch>
    // </div>
  );
};
// };

export default Home;

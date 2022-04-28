import React from "react";
import {
  Routes,
  Route,
  BrowserRouter,
  Switch,
  Redirect,
} from "react-router-dom";
import Login from "./components/auth/Login";
import Home from "./components/Home";
import NoMatch from "./components/no_page/NoMatch";
import Register from "./components/auth/Register";
import FinalHome from "./components/Dashboard";
import EditUser from "./Pages/EditUser";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      loggedInStatus: false,
    };

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(userData) {
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("userEmail", userData.email);
    // localStorage.setItem("loggedInStatus", true);
    this.setState({
      loggedInStatus: true,
    });
  }

  changeloggedInStatus() {
    localStorage.setItem("loggedInStatus", false);
    this.setState({
      loggedInStatus: false,
    });
  }

  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path={"/"}
              render={(props) => (
                <>
                  <Header />
                  <Login
                    {...props}
                    handleLogin={this.handleLogin}
                    loggedInStatus={this.state.loggedInStatus}
                  />
                </>
              )}
            />

            <Route
              exact
              path={"/home"}
              render={(props) => (
                <>
                  {/* <Header
                    {...props}
                    // changeloggedInStatus={this.changeloggedInStatus}
                    loggedInStatus={this.state.loggedInStatus}
                    userId={this.state.userId}
                  /> */}
                  <Header />
                  <Dashboard
                    {...props}
                    // changeloggedInStatus={this.changeloggedInStatus}
                    loggedInStatus={this.state.loggedInStatus}
                  />
                </>
              )}
            />

            <Route
              exact
              path={"/register"}
              render={() => (
                <>
                  <Header />
                  <Register />
                </>
              )}
            />

            <Route
              exact
              path={"/edit-profile"}
              render={(props) => (
                <>
                  <Header />
                  <EditUser
                    {...props}
                    // changeloggedInStatus={this.changeloggedInStatus}
                    loggedInStatus={this.state.loggedInStatus}
                    userId={this.state.userId}
                  />
                </>
              )}
            />
            <Route path="*" component={NoMatch} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;

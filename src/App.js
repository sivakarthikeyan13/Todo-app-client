import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Login from "./pages/auth/Login";
import NoMatch from "./pages/no_match/NoMatch";
import Register from "./pages/auth/Register";
import EditUser from "./pages/edit_user/EditUser";
import Header from "./components/header/Header";
import Home from "./pages/home/Home";

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
                  <Header />
                  <Home
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

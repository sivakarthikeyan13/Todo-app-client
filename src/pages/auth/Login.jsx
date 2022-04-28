import React from "react";
import "./auth.css";
import { Navigate, Redirect } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loginError: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSuccessfulAuth(userData) {
    this.props.handleLogin(userData);
    // TODO update App component(parent)
    this.props.history.replace("/home");
  }

  handleSubmit(event) {
    const { email, password } = this.state;
    const res = fetch("http://localhost:8080/api/signin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("login response", response);
        if (response.errorMessage) {
          this.setState({ loginError: response.errorMessage });
        } else {
          // this.props.navigate("/dashboard");
          this.handleSuccessfulAuth(response);
        }
      })
      .catch((error) => {
        // console.log("login error", error.message);
        // this.setState({ loginErrors: error.message });
      });

    event.preventDefault();

    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    this.setState({
      name: "",
      email: "",
      password: "",
      // loginErrors: "",
    });
  }

  render() {
    // localStorage.setItem("loggedInStatus", false);
    return (
      <div className="div-auth" style={{ height: "300px" }}>
        <p className="auth-text">Login</p>
        <form onSubmit={this.handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email..."
            value={this.state.email}
            onChange={this.handleChange}
            required
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Password..."
            value={this.state.password}
            onChange={this.handleChange}
            required
          />
          <br />
          <p
            style={{
              fontSize: "small",
              margin: "0 0",
              padding: "3px",
              fontWeight: "300",
            }}
          >
            New User?{" "}
            <span
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underLine",
              }}
              onClick={() => {
                this.props.history.push("/register");
              }}
            >
              register
            </span>
          </p>
          <button type="submit">Login</button>
        </form>
        <p className="error-text">{this.state.loginError}</p>
      </div>
    );
  }
}

export default Login;

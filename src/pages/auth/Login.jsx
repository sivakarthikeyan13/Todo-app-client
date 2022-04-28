import React from "react";
import "./auth.css";
// import { Navigate, Redirect } from "react-router-dom";

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
    //stores user credentials in local-storage
    this.props.handleLogin(userData);
    //direct to home page
    this.props.history.replace("/home");
  }

  handleSubmit(event) {
    console.log("Calling user-login api...");
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
        // console.log("login response", response);
        if (response.errorMessage) {
          console.log("User login failed- ", response.errorMessage);
          this.setState({ loginError: response.errorMessage });
        } else {
          console.log("User logged in successfully... ");
          this.handleSuccessfulAuth(response);
        }
      })
      .catch((error) => {
        console.log("login error: ", error.message);
      });

    //prevent page refresh after submit
    event.preventDefault();

    //clear input fields after submit
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );

    //clear states after submit
    this.setState({
      name: "",
      email: "",
      password: "",
      // loginErrors: "",
    });
  }

  render() {
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
              Register
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

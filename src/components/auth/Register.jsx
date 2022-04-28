import React from "react";
import "./auth.css";

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      registrationErrors: "",
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
    // TODO update App component(parent)
    this.props.history.push("/");
  }

  handleSubmit(event) {
    let { name, email, password, passwordConfirmation } = this.state;
    console.log("password", password);
    const res = fetch("http://localhost:8080/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirmation,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("registration response", response);
        if (response.errorMessage) {
          this.setState({ registrationError: response.errorMessage });
        } else {
          this.handleSuccessfulAuth(response);
        }
      })
      .catch((error) => {
        console.log("registration error", error);
      });

    event.preventDefault();

    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    this.setState({
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      registrationError: "",
    });
  }

  render() {
    return (
      <div className="div-auth">
        <p className="auth-text">Register</p>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name..."
            value={this.state.name}
            onChange={this.handleChange}
            required
          />
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
          <input
            type="password"
            name="passwordConfirmation"
            placeholder="Confirm Password..."
            value={this.state.passwordConfirmation}
            onChange={this.handleChange}
            required
          />
          <br />
          <button type="submit">Register</button>
        </form>
        <p className="error-text">{this.state.registrationError}</p>
      </div>
    );
  }
}

export default Register;

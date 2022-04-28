import React from "react";
import "./edituser.css";
import { Redirect } from "react-router-dom";

class EditUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      newPassword: "",
      passwordConfirmation: "",
      oldPassword: "",
      editUserError: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSuccessfulAuth = this.handleSuccessfulSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSuccessfulSubmit() {
    // TODO update App component(parent)
    this.props.history.push("/home");
  }

  handleSubmit(event) {
    const { name, email, password, passwordConfirmation, oldPassword } =
      this.state;
    console.log("password", password);
    const res = fetch(
      "http://localhost:8080/api/user/" + localStorage.getItem("userId"),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          passwordConfirm: passwordConfirmation,
          oldPassword: oldPassword,
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        console.log("edit user response", response);
        this.setState({ editUserError: response.message });
        if (response.message) {
          this.setState({ editUserError: response.message });
          console.log("error edituser", this.state.editUserError);
        } else {
          localStorage.setItem("userName", response.name);
          localStorage.setItem("userEmail", response.email);
          this.handleSuccessfulSubmit();
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
      oldPassword: "",
    });
  }

  render() {
    if (!this.props.loggedInStatus) {
      return <Redirect to="/" />;
    } else {
      return (
        <div>
          <div className="div-edituser">
            <p className="auth-text">Edit Profile</p>
            <p>If no change, enter the same value.</p>
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
              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password..."
                value={this.state.oldPassword}
                onChange={this.handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="New Password..."
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
              <input
                type="password"
                name="passwordConfirmation"
                placeholder="Confirm New Password..."
                value={this.state.passwordConfirmation}
                onChange={this.handleChange}
                required
              />
              <button type="submit">Change</button>
            </form>
            <p className="error-text">{this.state.editUserError}</p>
          </div>
        </div>
      );
    }
  }
}

export default EditUser;

import React from "react";
import "./home.css";
import ListItems from "../../components/list_item/ListItems";
import "react-datepicker/dist/react-datepicker.css";
import { BiEdit, BiMailSend, BiLogOut } from "react-icons/bi";
import { Redirect } from "react-router-dom";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: localStorage.getItem("userId"),
      taskName: "",
      isDone: false,

      date: "",
      addTaskErrors: "",
      feeds: null,
      length: 0,
      todayTasks: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDoneClick = this.handleDoneClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  async componentDidMount() {
    const resp = await fetch(
      "http://localhost:8080/api/todoItems/" + localStorage.getItem("userId")
    );
    const feeds = await resp.json();
    this.setState({ feeds });
    console.log("length", this.state.feeds.length);

    console.log(
      "today",
      new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0]
    );
    let todayTasks = 0;
    feeds.map((item) => {
      if (
        item.date ==
        new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0]
      ) {
        todayTasks += 1;
      }
    });
    this.setState({
      length: this.state.feeds.length,
      todayTasks: todayTasks,
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleDate = (date) => {
    this.setState({ date: date.target.value });
  };

  handleSubmit(event) {
    console.log("state date", this.state.date);
    const { userId, taskName, isDone, date, description } = this.state;
    fetch("http://localhost:8080/api/todoItems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        task: taskName,
        isDone: isDone,
        date: date,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("add response", response);
        const newItems = [...this.state.feeds, response];
        const newLen = this.state.length + 1;
        if (
          response.date ==
          new Date(
            new Date().getTime() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .split("T")[0]
        ) {
          this.setState({ todayTasks: this.state.todayTasks + 1 });
        }
        this.setState({
          feeds: newItems,
          length: newLen,
        });
      })
      .catch((error) => {
        console.log("registration error", error);
      });

    event.preventDefault();

    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    this.setState({
      taskName: "",
      isDone: false,
      date: "",
      addTaskErrors: "",
    });
  }

  handleSendMail(event) {
    fetch(
      "http://localhost:8080/api/sendEmail/" + localStorage.getItem("userId"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: localStorage.getItem("userEmail"),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        console.log("mail response", response);
      });
  }

  handleDoneClick(id, userId, task, isDone, date) {
    console.log("date", date);
    const res = fetch("http://localhost:8080/api/todoItems/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        task: task,
        isDone: !isDone,
        date: date,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("Item done response", response);
        //   this.setState({
        //     [event.target.name]: response.isDone,
        //   });
        const filterItems = this.state.feeds;
        console.log(filterItems);
        filterItems.map((item) => {
          if (item.id === id) {
            item.isDone = !isDone;
          }
          this.setState({
            feeds: [...filterItems],
          });
        });
        console.log("after change in state", filterItems);
      })
      .catch((error) => {
        console.log("item done error", error);
      });
  }

  handleDeleteClick(delItem) {
    const res = fetch("http://localhost:8080/api/todoItems/" + delItem.id, {
      method: "DELETE",
    })
      .then((response) => {
        console.log("Item done response", response.json());
        // this.setState({ id: "" });
        // this.props.parentCallBack(this.props.id);
        const filteredItems = this.state.feeds.filter(
          (item) => item.id !== delItem.id
        );
        const newLen = this.state.length - 1;
        if (
          delItem.date ==
          new Date(
            new Date().getTime() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .split("T")[0]
        ) {
          this.setState({ todayTasks: this.state.todayTasks - 1 });
        }
        this.setState({
          feeds: filteredItems,
          length: newLen,
        });
      })
      .catch((error) => {
        console.log("item done error", error);
      });
  }

  handleEditClick() {
    this.props.history.push("/edit-profile");
  }

  render() {
    if (!this.props.loggedInStatus) {
      return <Redirect to="/" />;
    } else {
      return (
        <div
          style={{
            // height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            // overflow: "hidden",
          }}
        >
          <div>
            <div className="div-finaltask">
              <span className="div-finaltask-text">Add Task</span>
              <form onSubmit={this.handleSubmit} className="form-finaltask">
                <div className="form-input">
                  <div className="form-child">
                    <input
                      type="text"
                      name="taskName"
                      placeholder="Task"
                      value={this.state.name}
                      onChange={this.handleChange}
                      required
                    />
                    <input
                      type="date"
                      onChange={this.handleDate}
                      value={this.state.date}
                      min={
                        new Date(
                          new Date().getTime() -
                            new Date().getTimezoneOffset() * 60000
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                      required
                    />
                  </div>

                  <button type="submit" className="btn-finaltask">
                    +
                  </button>
                </div>
              </form>
            </div>

            <div
              className="div-finaltask"
              style={{ height: "200px", marginTop: "40px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <span className="div-finaltask-text">Details</span>

                <BiMailSend
                  className="icon-home"
                  size={28}
                  onClick={this.handleSendMail}
                />
              </div>

              <p
                style={{
                  fontSize: "large",
                  fontFamily: "Roboto",
                  fontWeight: "400",
                }}
              >
                Total Tasks
                <br />
                <span
                  style={{
                    fontSize: "xx-large",
                    fontFamily: "Roboto",
                    fontWeight: "700",
                  }}
                >
                  {this.state.length}
                </span>
              </p>
              <p
                style={{
                  fontSize: "large",
                  fontFamily: "Roboto",
                  fontWeight: "400",
                }}
              >
                Scheduled for Today
                <br />
                <span
                  style={{
                    fontSize: "xx-large",
                    fontFamily: "Roboto",
                    fontWeight: "700",
                  }}
                >
                  {this.state.todayTasks}
                </span>
              </p>
            </div>

            <div
              className="div-finaltask"
              style={{ height: "130px", marginTop: "40px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <span className="div-finaltask-text">Profile</span>
                <div>
                  <BiEdit
                    className="icon-home"
                    size={28}
                    onClick={this.handleEditClick}
                  />

                  <BiLogOut
                    className="icon-home"
                    style={{ marginLeft: "20px" }}
                    size={28}
                    onClick={() => {
                      localStorage.clear();
                      this.props.history.replace("/");
                    }}
                  />
                </div>
              </div>

              <p
                style={{
                  fontSize: "large",
                  fontFamily: "Roboto",
                  fontWeight: "400",
                }}
              >
                {localStorage.getItem("userName")}
              </p>
              <p
                style={{
                  fontSize: "large",
                  fontFamily: "Roboto",
                  fontWeight: "400",
                }}
              >
                {localStorage.getItem("userEmail")}
              </p>
            </div>
          </div>
          <div className="div-list">
            <div className="div-finaltask-text">Tasks</div>

            <div className="div-finaltodolist-scroll">
              <ListItems
                items={this.state.feeds}
                doneItem={this.handleDoneClick}
                deleteItem={this.handleDeleteClick}
              />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Home;

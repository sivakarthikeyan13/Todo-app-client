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

  //fetch todo list after mount
  async componentDidMount() {
    const resp = await fetch(
      "http://localhost:8080/api/todoItems/" + localStorage.getItem("userId")
    );
    const feeds = await resp.json();
    this.setState({ feeds });

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

  //set date state
  handleDate = (date) => {
    this.setState({ date: date.target.value });
  };

  handleSubmit(event) {
    console.log("Calling create-task api...");
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
        // console.log("add response", response);
        console.log("New Task added successfully...");

        //add new item to list
        const newItems = [...this.state.feeds, response];

        // update total tasks count
        const newLen = this.state.length + 1;

        //check for today's task and update count
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

        // set states to update Details counter
        this.setState({
          feeds: newItems,
          length: newLen,
        });
      })
      .catch((error) => {
        console.log("registration error", error);
      });

    //prevent page refresh after submit
    event.preventDefault();

    //clear input fields after submit
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );

    //clear states after submit
    this.setState({
      taskName: "",
      isDone: false,
      date: "",
      addTaskErrors: "",
    });
  }

  handleSendMail() {
    console.log("Calling send-email api...");
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
      })
      .catch((error) => {
        console.log("Email sender error", error);
      });
  }

  handleDoneClick(id, userId, task, isDone, date) {
    console.log("Calling update-task api...");
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
        console.log("Item updated successfully");
        console.log("Item response", response);
        const filterItems = this.state.feeds;
        //update item checkbox
        filterItems.map((item) => {
          if (item.id === id) {
            item.isDone = !isDone;
          }
          //set isDone state
          this.setState({
            feeds: [...filterItems],
          });
        });
      })
      .catch((error) => {
        console.log("item update error", error);
      });
  }

  handleDeleteClick(delItem) {
    console.log("Calling delete-item api...");
    fetch("http://localhost:8080/api/todoItems/" + delItem.id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.errorMessage) {
          console.log("Item Deletion failed- ", response.errorMessage);
        } else {
          console.log("Item deleted successfully...");
          console.log("item delete response: ", response);
          //filter deleted item
          const filteredItems = this.state.feeds.filter(
            (item) => item.id !== delItem.id
          );
          //update total tasks count
          const newLen = this.state.length - 1;
          //check if today's task is deleted
          if (
            delItem.date ==
            new Date(
              new Date().getTime() - new Date().getTimezoneOffset() * 60000
            )
              .toISOString()
              .split("T")[0]
          ) {
            //update today's tasks counter if deleted
            this.setState({ todayTasks: this.state.todayTasks - 1 });
          }

          //set states to update details counter
          this.setState({
            feeds: filteredItems,
            length: newLen,
          });
        }
      })
      .catch((error) => {
        console.log("item done error", error);
      });
  }

  handleEditClick() {
    console.log("redirecting to edit-profile page...");
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
                  onClick={() => {
                    const confirmBox = window.confirm(
                      "Send Today's Tasks to your Mail?"
                    );
                    if (confirmBox === true) {
                      this.handleSendMail();
                    }
                  }}
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
                    onClick={() => {
                      this.handleEditClick();
                    }}
                  />

                  <BiLogOut
                    className="icon-home"
                    style={{ marginLeft: "20px" }}
                    size={28}
                    onClick={() => {
                      const confirmBox = window.confirm(
                        "Are you sure you want to log out?"
                      );
                      if (confirmBox === true) {
                        localStorage.clear();
                        this.props.changeloggedInStatus();
                        this.props.history.replace("/");
                      }
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

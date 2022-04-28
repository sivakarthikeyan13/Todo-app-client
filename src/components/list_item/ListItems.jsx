import React from "react";
import "./list-items.css";
import { FiX } from "react-icons/fi";

function ListItems(props) {
  const items = props.items;
  const listItems =
    items &&
    items.map((item) => {
      return (
        <div className="div-list-item" key={item.id}>
          <div
            style={{
              width: "100px",
              padding: "5px",
              margin: "5px",
            }}
          >
            {item.date}
          </div>
          <div
            style={{
              width: "350px",
              padding: "5px",
              margin: "5px",
            }}
          >
            <input
              type="checkbox"
              name="isDone"
              checked={item.isDone}
              onChange={() =>
                props.doneItem(
                  item.id,
                  item.userId,
                  item.task,
                  item.isDone,
                  item.date
                )
              }
              style={{
                width: "20px",
                height: "20px",
                padding: "5px",
                margin: "5px",
              }}
            />
            <span>{item.task}</span>
          </div>

          <div>
            <FiX
              className="icon"
              size={32}
              color={"gray"}
              onClick={() => props.deleteItem(item)}
            />
          </div>
        </div>
      );
    });
  return <div>{listItems}</div>;
}

export default ListItems;

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
          <div>
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
            <span
              style={{
                padding: "5px",
                margin: "5px",
              }}
            >
              {item.date}
            </span>
            <button
              className="span-delete"
              onClick={() => props.deleteItem(item)}
            >
              X{/* <FiX size={24} color={"gray"} /> */}
            </button>
          </div>
        </div>
      );
    });
  return <div>{listItems}</div>;
}

export default ListItems;

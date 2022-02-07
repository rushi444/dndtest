import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Draggable = ({ item }) => {
  const [collected, drag, dragPreview] = useDrag(() => ({
    type: "ticket",
    item,
  }));
  return (
    <div
      style={{ border: "1px solid red", margin: ".5rem" }}
      ref={drag}
      // {...collected}
    >
      {item.name}
    </div>
  );
};

const Droppable = ({ item, setItems, onDrop }) => {
  const [collectedProps, drop] = useDrop(
    () => ({
      accept: "ticket",
      drop: (_item, monitor) => {
        onDrop({ parentId: item.id, childId: _item.id });
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [setItems]
  );

  return (
    <div
      ref={drop}
      style={{
        border: "1px solid black",
        margin: "1rem",
      }}
    >
      {item.name}
      {item?.children?.length > 0 ? (
        <div>
          {React.Children.toArray(
            item.children.map((child) => (
              <Draggable key={child.id} item={child} />
            ))
          )}
        </div>
      ) : null}
    </div>
  );
};

function App() {
  const [items, setItems] = useState(() => [
    {
      id: 1,
      name: "Parent 1",
      children: [
        { id: 3, name: "child 1", children: [] },
        { id: 4, name: "child 2", children: [] },
      ],
    },
    {
      id: 2,
      name: "Parent 2",
      children: [
        { id: 5, name: "child 3", children: [] },
        { id: 6, name: "child 4", children: [] },
      ],
    },
  ]);
  console.log({ items });
  const onDrop = ({ parentId, childId }) => {
    // Remove child from previous parent
    const removedChildArr = items.map((item) => {
      const itemChildrenIds = item.children.map((child) => child.id);

      if (itemChildrenIds.includes(childId)) {
        return {
          ...item,
          children: item.children.filter((child) => child.id !== childId),
        };
      }
      return item;
    });

    // Add child to new parent
    const child = items
      .flatMap((i) => i.children)
      .find((child) => child.id === childId);

    const newItems = removedChildArr.map((item) => {
      if (item.id === parentId) {
        return { ...item, children: [...item.children, child] };
      }
      return item;
    });

    setItems(newItems);
  };
  return (
    <div className="App">
      <h1>Mosaic</h1>
      <DndProvider backend={HTML5Backend}>
        {React.Children.toArray(
          items.map((item, index) => (
            <Droppable
              key={item.id}
              item={item}
              setItems={setItems}
              onDrop={onDrop}
            />
          ))
        )}
      </DndProvider>
    </div>
  );
}

export default App;

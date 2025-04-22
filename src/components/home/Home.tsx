import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../header";
import Sidebar from "../sidebar";

function Home() {
  const [opened, setOpened] = React.useState(false);

  return (
    <div className={`app-shell ${opened ? "opened" : ""}`}>
      <Header opened={opened} setOpened={setOpened} />

      <Sidebar opened={opened} setOpened={setOpened} />

      <div className="main">
        <Outlet />
      </div>
    </div>
  );
}

export default Home;

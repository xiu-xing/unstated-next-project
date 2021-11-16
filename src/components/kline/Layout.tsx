import React from "react";

const Layout: React.FunctionComponent<{ title: string }> = (props) => {
  const { title, children } = props;
  return (
    <div
      className="k-line-chart-container"
      style={{ backgroundColor: "#1f2126" }}
    >
      <h3 className="k-line-chart-title" style={{ color: "white" }}>
        {title}
      </h3>
      {children}
    </div>
  );
};

export default Layout;

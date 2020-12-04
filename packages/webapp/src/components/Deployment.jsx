import React from "react";

const Deployment = ({ name, createdAt, status }) => (
  <li>
    {name} - {new Date(parseInt(createdAt, 10)).toLocaleString()} - {status}
  </li>
);

export default Deployment;

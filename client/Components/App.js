import React, { useState } from "react";

const App = () => {
  const [value] = useState(Date.now());
  return <h1>Hello! {value}</h1>;
};
export default App;
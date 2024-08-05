import HomePage from "./homepage";
import TextEditor from "./textEditor";
import Login from "./login";
import Signup from "./signup";

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage/>}></Route>
        <Route path="/login" exact element={<Login/>}></Route>
        <Route path="/signup" exact element={<Signup/>}></Route>
        <Route path="/:id" element={<TextEditor />}>
        </Route>
      </Routes>
    </Router>
  )
}

export default App;

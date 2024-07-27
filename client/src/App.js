import TextEditor from "./textEditor";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Navigate to={`/${uuidv4()}`} />}/>
        <Route path="/:id" element={<TextEditor />}>
        </Route>
      </Routes>
    </Router>
  )
}

export default App;

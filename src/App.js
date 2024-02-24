import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Meeting from './pages/Meeting';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/meeting' element={<Meeting/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

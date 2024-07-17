import {HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Act1 from './Pages/Activity1/Activity1';
import Act2 from './Pages/Activity2/Activity2';
import Act3 from './Pages/Activity3/Activity3';
import Act4 from './Pages/Activity4/Activity4';
import Act5 from './Pages/Activity5/Activity5';
import Act6 from './Pages/Activity6/Activity6';
import Home from './Pages/Home/Home';
import NavBar from './Components/NavBar';

function App() {
  return (
    //different routes accessible by the user.
    <Router>
      <NavBar/>
      <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path='/activityone' exact element={<Act1/>} />
        <Route path='/activityone/:id' exact element={<Act1/>} />
        <Route path="/activitytwo" exact element={<Act2/>} />
        <Route path='/activitytwo/:id' exact element={<Act2/>} />
        <Route path="/activitythree"exact element={<Act3/>} />
        <Route path='/activitythree/:id' exact element={<Act3/>} />
        <Route path="/activityfour"exact element={<Act4/>} />
        <Route path='/activityfour/:id' exact element={<Act4/>} />
        <Route path="/activityfive"exact element={<Act5/>} />
        <Route path='/activityfive/:id' exact element={<Act5/>} />
        <Route path="/activitysix" exact element={<Act6/>} />
        <Route path='/activitysix/:id' exact element={<Act6/>} />
        <Route path="/home" element={<Home/>} />
      </Routes>
    </Router>
  )
}

export default App;

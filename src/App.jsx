import {useState} from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import Favorieten from './pages/Favorieten/Favorieten';
import Keuzehulp from "./pages/Keuzehulp/Keuzehulp";
import Login from './pages/Login/Login';
import Ontdekken from "./pages/Ontdekken/Ontdekken";
import Informatie from "./pages/Informatie/Informatie";

import NavBar from "./components/NavBar/NavBar";

function App() {
    const [count, setCount] = useState(0);

    return (
        <Router>
            <div className="app">
                <NavBar NavigationLinkOneTo="/ontdekken"
                        NavigationLinkOneChildren="Ontdekken"
                        NavigationLinkTwoTo="/keuzehulp"
                        NavigationLinkTwoChildren="Keuzehulp"
                        ButtonPrimaryTo="/login"
                        ButtonPrimaryChildren="Inloggen"
                        ButtonSecondaryTo="/favorieten"
                        ButtonSecondaryChildren="Favorieten"/>

                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/ontdekken" element={<Ontdekken/>}/>
                    <Route path="/informatie" element={<Informatie/>}/>
                    <Route path="/keuzehulp" element={<Keuzehulp/>}/>
                    <Route path="/favorieten" element={<Favorieten/>}/>
                    <Route path="/Login" element={<Login/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
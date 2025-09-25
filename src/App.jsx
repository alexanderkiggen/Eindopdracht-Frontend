import {useState} from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import Favorieten from './pages/Favorieten/Favorieten';
import Keuzehulp from "./pages/Keuzehulp/Keuzehulp";
import Login from './pages/Login/Login';
import Ontdekken from "./pages/Ontdekken/Ontdekken";
import Informatie from "./pages/Informatie/Informatie";

import ButtonPrimary from "./components/ButtonPrimary/ButtonPrimary";
import ButtonSecondary from "./components/ButtonSecondary/ButtonSecondary";
import SearchBar from "./components/Searchbar/SearchBar";

function App() {
    const [count, setCount] = useState(0);

    return (
        <Router>
            <div className="app">
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/ontdekken">Ontdekken</Link>
                    <Link to="/keuzehulp">Keuzehulp</Link>
                    <Link to="/informatie">Informatie</Link>
                    <ButtonSecondary to="/favorieten">Favorieten</ButtonSecondary>
                    <ButtonPrimary to="/login">Inloggen</ButtonPrimary>
                    <SearchBar onSubmit={(value) => console.log("Zoekterm:", value)}/>

                </nav>

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
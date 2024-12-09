import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AcceptDonationForm from './components/AcceptDonation';
import FindItem from './components/FindItem';
import FindOrder from './components/FindOrder';
import Login from './components/Login';
import Navbar from './components/Navbar';
import React from 'react';
import ShoppingPage from './components/ShoppingPage';
import StartOrder from './components/StartOrder';

function App() {
    return (
        <BrowserRouter>
            <Navbar/>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/find-item" element={<FindItem />} />
                    <Route path="/find-order" element={<FindOrder />} />
                <Route path="/start-order" element={<StartOrder />} />
                <Route path="/accept-donation" element={<AcceptDonationForm/>}/>
                <Route path="/shopping" element={<ShoppingPage/>}/>
                </Routes>
            </BrowserRouter>
        
    );
}

export default App;

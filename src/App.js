import logo from './logo.svg';
import './App.css';
import Navbar from './UseContextDemocomponents/Navbar.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Products from './UseContextDemocomponents/Product.js';
import Cart from './UseContextDemocomponents/Cart.js';

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />} >
          <Route path="/cart" element={<Cart />} />
          <Route path="/products" element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

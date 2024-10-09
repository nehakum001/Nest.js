import React from 'react'
import { BrowserRouter, Link, NavLink, Outlet, Route, Routes } from 'react-router-dom';
import styles from './style.css';
import { AddToCart } from './useCartProductsContext';

const Navbar = () => {
    return (
        <AddToCart>
            <nav >
                <Link style={styles.link} to='products'>Products</Link>
                <Link style={styles.link} to='cart'>Cart</Link>
            </nav>
            <Outlet/>
          
        </AddToCart>
    )
}
export default Navbar


import React, { useContext, useState } from 'react';
import Navbar from './Navbar';
import './style.css';
import { addedToCartContext } from './useCartProductsContext';

const productsDemo = [{ p_id: 1, p_n: 'p1' }, { p_id: 2, p_n: 'p2' }, { p_id: 3, p_n: 'p3' }]

const Products = () => {
    const [products, setProducts] = useState(productsDemo);
    const {addedToCartData, AddToCartFun} = useContext(addedToCartContext);
    // const [cartProducts, SetCartProducts] = useState([]);
    return (
        <ul >
            <li> <p>Product Id</p>
                <p>Product name</p></li>
            {products.map((ele) => (
                <li>
                    <p>{ele.p_id}</p>
                    <p>{ele.p_n}</p>
                    <button onClick={() => AddToCartFun(ele)}>Add to cart</button>
                </li>
            ))}
        </ul>
    )
}

export default Products;

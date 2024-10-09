
import React, { useContext, useState } from 'react';
import { addedToCartContext } from './useCartProductsContext';

 const Cart =()=> {
    const {addedToCartData,AddToCartFun} = useContext(addedToCartContext);
    const [addedToCart, setAddedToCart] = useState([]);
    return (
        <div>
            <ul>
                {addedToCartData.length>0 && addedToCartData.map((ele) => (
                    <li style={{border: '1px solid black' , color:'green'}}>  
                        <p> {ele.p_id}</p>
                        <p> {ele.p_n}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Cart;

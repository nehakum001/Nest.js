import React, { Children, createContext, useState } from 'react'

const addedToCartContext = createContext([]);

const AddToCart = ({children}) => {

    const [addedToCartData, setAddedToCart] = useState([]);

    const AddToCartFun = (productTobeAdded) => {
        setAddedToCart([...addedToCartData,productTobeAdded]);
    }

    return (
        <addedToCartContext.Provider value={{ addedToCartData, AddToCartFun }}>
            {children}
        </addedToCartContext.Provider>
    )
}

export { addedToCartContext, AddToCart };

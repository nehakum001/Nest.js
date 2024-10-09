import React, { useEffect, useState } from 'react';

// findIndex(it takes a callback), indexOf(its take element of an array or an obj)

const FetchComponent = () => {
    const [responseData, setResponseData] = useState([]);
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [dropdownValue, setDropdownValue] = useState('All');



    const fetchData = async () => {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setResponseData(data);
        const categoryArray = data.map((ele) => ele.category)
        const removedup = categoryArray.filter((ele,index)=> categoryArray.indexOf(ele) === index);
        //remove duplicate data
        setCategory(removedup);
        console.log(responseData)
    }

    useEffect(() => {
        fetchData();
    }, [])

    const autoSelect = (selectedCategory) => {
        setDropdownValue(selectedCategory);
        const autoselectcategory = category.filter((ele,index)=> ele.includes(selectedCategory));
        //remove duplicate data
        setSelectedCategory(autoselectcategory)
    }

    //MoveDown
    const swapData = (selectedData) => {
        if (responseData.findIndex((ele) => ele.id === selectedData.id) === responseData.length - 1)
            return
        const selectedEleIndex = responseData.findIndex((ele) => ele.id === selectedData.id);
        const updatedArray = [...responseData];
        const temp = updatedArray[selectedEleIndex];
        updatedArray[selectedEleIndex] = updatedArray[selectedEleIndex + 1];
        updatedArray[selectedEleIndex + 1] = temp;
        setResponseData([...updatedArray]);
    }



    return (
        <div class="center">
            <input value={dropdownValue} onChange={(e)=>{autoSelect(e.target.value)}}/>
            <ul>
                {selectedCategory.map((ele)=><li>{ele}</li>)}
            </ul>
            {/* <select width='100%' value={dropdownValue} onChange={(e)=>{autoSelect(e.target.value)}}>{dropdownValue}
               { category?.map((ele)=> <option value={ele}>{ele}</option>)}
            </select> */}
            <ol>
                {
                    responseData.map((ele, index) => <li>
                        <p>{ele.id}</p>
                        <p>{ele.title}</p>
                        <p>{ele.category}</p>
                        <p>
                            <button onClick={() => { swapData(ele) }}>MoveDown</button>
                        </p>
                    </li>
                    )
                }
            </ol>
        </div>
    );

}

export default FetchComponent;

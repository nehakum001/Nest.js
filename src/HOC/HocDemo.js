import React from 'react'

const ComponentToWrap = (props) => {
    return (
        <div>
            {props.name}
        </div>
    )
}

const WrapperComponent = (Component) => {
    return (props) => {
        return (
            <div>
                <Component {...props} />
            </div>
        )
    }

}

const RefComponent = WrapperComponent(ComponentToWrap);

const HocDemo = () => {
    return <RefComponent name="neha" />
    

}

export default HocDemo

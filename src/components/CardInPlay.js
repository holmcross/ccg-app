import React, { useState } from 'react'

const CardInPlay = (props) => {
    // creature
    if (props.cardProps.type === 1){
        return (<div className="CardInPlay" onClick={()=> props.tapCardProps(props.cardProps)}>
            <div className="CardInPlay-Header">
                {props.cardProps.name}
            </div>
            <div>{props.cardProps.power}/{props.cardProps.toughness}</div>
        </div>)
    } 
    // land
    else if(props.cardProps.type === 0){
        return (<div className="CardInPlay" onClick={()=> props.tapCardProps(props.cardProps)}>
            <div className="CardInPlay-Header">
                {props.cardProps.name}
            </div>
        </div>)
    }
}

export default CardInPlay
import React, { useState } from 'react'
import { Mana } from "@saeris/react-mana"

const CardInPlay = (props) => {
    // creature
    if (props.cardProps.type === 1){
        return (<div className="CardInPlay" onClick={()=> props.tapCardProps(props.cardProps)}>
            <div className="Card-Header">
                {props.cardProps.name}
                <div className='Card-Cost'>{Array.prototype.map.call(
                    props.cardProps.printableManaCost?.toLowerCase(), item => <Mana symbol={item}/>
                )}</div>
            </div>
            {(props.cardProps.tapped) && "TAPPED"}
            <div className="Card-PT" style={{}}>{props.cardProps.power}/{props.cardProps.toughness}</div>
        </div>)
    } 
    // land
    else if(props.cardProps.type === 0){
        return (<div className="CardInPlay" onClick={()=> props.tapCardProps(props.cardProps)}>
            <div className="Card-Header">
                {props.cardProps.name}
            </div>
            {(props.cardProps.tapped) && "TAPPED"}
        </div>)
    }
}

export default CardInPlay
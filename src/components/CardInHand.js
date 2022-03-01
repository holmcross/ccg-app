import React, { useState } from 'react'
import { Mana } from "@saeris/react-mana"

const CardInHand = (props) => {
    if(props.cardProps.type === 1){
        return <div className="CardInHand" 
            onClick={() => 
                props.castSpellProps(props.cardProps)}>
                    <div className="Card-Header">
                        <div> {props.cardProps.name} </div>
                        <div className='Card-Cost'>{Array.prototype.map.call(
                            props.cardProps.printableManaCost?.toLowerCase(), item => <Mana symbol={item}/>
                        )}
                        </div>
                    </div>
                <div className="Card-PT" style={{}}>{props.cardProps.power}/{props.cardProps.toughness}</div>
            </div>
    } else if (props.cardProps.type === 0) {
        return <div className="CardInHand" 
            onClick={() => 
                props.playLandProps(props.cardProps)}>
                    <div className="Card-Header">
                        {props.cardProps.name}
                    </div>
            </div>  
    }
}
export default CardInHand
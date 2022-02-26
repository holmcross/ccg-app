import React from "react"
import CardInPlay from "./CardInPlay"

const PlayingZone = (props) => {
    console.log("PlayingZone component props is:", props)
    return <div className="PlayingZone">
        {props.cardsInPlayProps.map((card, index) => 
            <CardInPlay 
                cardProps={card}
                tapCardProps={props.tapCardProps}
                key={index}
            />
        )}
    </div>
}

export default PlayingZone
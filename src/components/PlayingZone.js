import React from "react"
import CardInPlay from "./CardInPlay"

const PlayingZone = (props) => {
    console.log("PlayingZone component props is:", props)
    return <div class="PlayingZone">
        {props.cardsInPlayProps.map(card => 
            <CardInPlay 
                cardProps={card}
                tapCardProps={props.tapCardProps}
            />
        )}
    </div>
}

export default PlayingZone
import React from "react"
import CardInPlay from "./CardInPlay"

const PlayingZone = (props) => {
    return <div class="PlayingZone">
        {props.cardsInPlayProps.map(card => 
            <CardInPlay 
                cardProps={card}
            />
        )}
    </div>
}

export default PlayingZone
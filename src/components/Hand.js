import React from "react";
import CardInHand from "./CardInHand";

const Hand = (props) => {
    return <div class="Hand">
        {props.handProps.map( card =>
            <CardInHand 
                cardProps={card} 
                dispatchPlayerActionsProps={props.dispatchPlayerActionsProps}
                castSpellProps={props.castSpellProps}
                playLandProps={props.playLandProps}
            /> 
        )}
    </div>
}

export default Hand
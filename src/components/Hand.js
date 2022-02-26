import React from "react";
import CardInHand from "./CardInHand";

const Hand = (props) => {
    return <div className="Hand">
        {props.handProps.map( (card, index) =>
            <CardInHand 
                cardProps={card} 
                dispatchPlayerActionsProps={props.dispatchPlayerActionsProps}
                castSpellProps={props.castSpellProps}
                playLandProps={props.playLandProps}
                tapCardProps={props.tapCardProps}
                key={index}
            /> 
        )}
    </div>
}

export default Hand
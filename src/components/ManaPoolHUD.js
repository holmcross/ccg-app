import React from "react";

const ManaPoolHUD = (props) => {
    return <div>
        Mana: {props.currentManaProps} / {props.maxManaProps}
    </div>
}

export default ManaPoolHUD
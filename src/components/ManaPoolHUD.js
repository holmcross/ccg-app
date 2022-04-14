import React from 'react'

const ManaPoolHUD = (props) => {
  return <div className='ManaPoolHUD'>
        <b>Mana: {props.currentManaProps} / {props.maxManaProps}</b>
        &nbsp;|&nbsp;<b>Turn: {props.playerStateProps.turn}</b>
        &nbsp;|&nbsp;<b>Player Hitpoints: {props.playerStateProps.hitpoints}</b>
    </div>
}

export default ManaPoolHUD

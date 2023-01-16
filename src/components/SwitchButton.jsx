import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { MenuIcon, settingIcon, volumnIcon } from '../assets/icons'

export const Button = styled.button`
  width: 80px;
  height:80px;
  cursor: pointer;
  border-radius: 50%;
  border: ${props => !props.iconSwitch ? "2px solid #CEBDCD" : "none"} ;
  background-color: ${props => props.background};
  background-image: ${props => `url(${props.iconSwitch})`} ;
  background-repeat:no-repeat;
  background-position:center;
  background-size:cover;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`

export default function SwitchButton({
  handleTurnOn,
  handleTurnOff,
  iconTurnOn,
  iconTurnOff,
  icon,
  onClick,
  handleSetState,
  backgroundColorTurnOn = "green",
  backgroundColorTurnOff = "#CA1617",
  ...rest
}) {
  const [isTurnOn, setIsTurnOn] = useState(false)
  const handleClick = () => {
    if (!icon) setIsTurnOn(!isTurnOn)
    onClick?.()
    handleSetState(setIsTurnOn)
  }

  useEffect(() => {
    if (!isTurnOn) {
      handleTurnOn?.()
    } else {
      handleTurnOff?.()
    }
  }, [isTurnOn])

  return (
    <Button
      background={isTurnOn ? backgroundColorTurnOn : backgroundColorTurnOff}
      onClick={handleClick}
      iconSwitch={!icon ? !isTurnOn ? iconTurnOn : iconTurnOff : icon}
      value={isTurnOn}
      {...rest}
    />
  )
}

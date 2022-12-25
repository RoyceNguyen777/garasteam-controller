import React, { useRef } from 'react'
import styled from 'styled-components'
import { Button } from './SwitchButton'

const ControllerButton = styled(Button)`
    margin: 15px;
    background-color: transparent;
    border: none;
    color: #FF8C02;
    width: 200px;
    height: 200px;
    font-size: 180px;   
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    transition: all 2s;

    &:focus {
        box-shadow: 
        rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, 
        rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, 
        rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;    
    }

    ::after {
        content: "";
        position: absolute;
        right: 0;
        left: 0;
        bottom: 0;
        top: 0;
        background-color: #ffff;
        border-radius: 50%;
        z-index: -1;
        opacity: 0.4;
    }
    
`

export default function Controller({ position, onClick }) {
    const ref = useRef()

    return (
        <ControllerButton
            ref={ref}
            children={
                <i
                    className={`fas fa-caret-${position}`}
                    style={{ ...(position === "left" ? { marginRight: 20 } : position === "up" ? { marginBottom: 20 } : position === "right" ? { marginLeft: 20 } : "") }} />
            }
            onClick={onClick}
        />
    )
}

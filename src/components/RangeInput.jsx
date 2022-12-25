import React from 'react'
import styled from 'styled-components'
import { inputBg } from '../assets/icons'

const InputRange = styled.input.attrs({
  type: "range",
})`
    width: 400px;
    -webkit-appearance: none;
    background-image: ${props => `url(${props.bg})`};


  &::-webkit-slider-runnable-track {
    width: 300px;
    height: 50px;
    background: #ddd;
    border: none;
    background-image: ${props => `url(${props.bg})`};
    background-position:center;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: none;
    height: 100%;
    width: 20px;
    background: #FF4181;

  }

  &:focus {
    outline: none;
  }

  &:focus::-webkit-slider-runnable-track {
    background-image: ${props => `url(${props.bg})`};
  }
`
export default function RangeInput({ onChange, ...rest }) {
  return (
    <InputRange bg={inputBg} defaultValue={0} onChange={onChange} />
  )
}

import React, { Component } from "react"

import styled from "styled-components"
import { color, media } from "../../Library/Styles/index"
import sound from "../../Library/Images/icon-sound.png"

export const Container = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background-color: ${color.blue};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  ${media.phone`
    width: 40px;
    height: 40px;
`};
`

const Audio = function(props) {
  return (
    <Container onClick={() => document.getElementById("audio-element").play()}>
      <img src={sound} style={{ width: "30px", height: "30px" }} />
      <audio
        id="audio-element"
        src={require(`../../Library/Audio/${props.word}.mp3`)}
        autoPlay
      />
    </Container>
  )
}

export default Audio

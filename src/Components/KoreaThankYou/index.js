import React, { Component } from "react"
import { Redirect } from "react-router"
import styled from "styled-components"

import { shouldRedirect } from "../../Library/helpers"

import Button from "../Common/button"
import Header from "../Common/header"

import { color } from "../../Library/Styles/index"
import wallpaper from "../../Library/Images/korea-wallpaper.png"

class KoreaThankYou extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    if (shouldRedirect(this.state, window.location)) {
      return <Redirect push to={this.state.redirect} />
    }

    return (
      <Container>
        <p style={{ fontSize: "2em" }}>
          기술 영어의 90 %는 라틴어와 그리스어입니다.
          <br />
          <br />
          Wordcraft는 배우는 가장 빠른 방법입니다.
          <br />
          <br />
          hello@playwordcraft.com
        </p>
        <br />
        <br />
        <Button.medium
          style={{ width: "200px" }}
          onClick={() => this.setState({ redirect: "/" })}
        >
          Home
        </Button.medium>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(${wallpaper});
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export default KoreaThankYou

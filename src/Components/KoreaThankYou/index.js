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
        <WhiteBg>
          <p style={{ fontSize: "2em" }}>
            영어에 있어서 학업 용어와 기술적 용어의 90%는 라틴어와 헬라어
            어원에서 비롯된 것입니다.
            <br />
            <br />
            Wordcraft 는 학업 용어 와 기술적 용어를 가르치는 유일한 교육 시스템
            입니다.
            <br />
            <br />
            contact:{" "}
            <a
              href={"mailto:hello@playwordcraft.com"}
              style={{ color: color.blue, textDecoration: "none" }}
            >
              {" "}
              hello@playwordcraft.com
            </a>
          </p>
          <br />
          <br />
          <Button.medium
            style={{ width: "200px" }}
            onClick={() => this.setState({ redirect: "/" })}
          >
            Home
          </Button.medium>
        </WhiteBg>
      </Container>
    )
  }
}

const WhiteBg = styled.div`
  border-radius: 10px;
  padding: 30px 15px;
  background-color: rgba(255, 255, 255, 0.9);
  max-width: 800px;
`

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

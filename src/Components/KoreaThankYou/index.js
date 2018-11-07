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
            In English, 90% of academic and technical vocabulary is based on
            Latin and Greek root words.
            <br />
            <br />
            Wordcraft is the only rapid-feedback language training system
            devoted exclusively to academic and technical English. <br />
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

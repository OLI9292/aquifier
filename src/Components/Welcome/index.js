import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import jsPDF from 'jspdf';
import _ from 'underscore';

import { color, media } from '../../Library/Styles/index';
import zipIcon from '../../Library/Images/blue-zip.png';
import accountCard from '../../Library/Images/account-card.jpg';

const TEACHER = ['a.jacobs','super-lame-password']
const STUDENTS = [['ben.b', 'super-lame-password'], ['oliver.p', 'super-cool-password']]

class Welcome extends Component {
  componentDidMount() {
    console.log(this.props)
    // this.createPdf()
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
  }

  createPdf() {
    const doc = new jsPDF()

    doc.setTextColor(243,190,91)
    doc.text(10, 10, 'WORDCRAFT')

    doc.setTextColor(0,0,0)
    doc.text(10, 30, 'Teacher Account')
    doc.text(10, 40, TEACHER.join(' '))

    let height = 60
    doc.text(10, height, 'Student Accounts')

    _.forEach(STUDENTS, student => {
      height += 10
      doc.text(10, height, student.join(' '))      
    })

    _.forEach(STUDENTS, student => this.addPage(doc, student))    

    doc.save('accounts.pdf')
    doc.output('datauri')
  }

  addPage(doc, student) {
    doc.addPage()
    doc.setTextColor(243,190,91)
    doc.setTextColor(0,0,0)
    doc.text(10, 10, student.join(' '))    
  }

  render() {
    return (
      <Container>
        <p style={{fontSize:'2.75em',color:color.yellow}}>
          WORDCRAFT
        </p>

        <p style={{fontSize:'1.75em',marginTop:'-20px'}}>
          Your free Wordcraft membership has begun!
        </p>

        <br />

        <p style={{fontSize:'1.25em',width:'60%',margin:'0 auto'}}>
          Print and keep the attached materials.
          <br />
          <br />
          Email us if you have any questions or need help. Have fun!
        </p>        

        <a href="my-program.zip" download>
          <img
            style={{height:'45px',width:'45px',cursor:'pointer',margin:'0 auto'}}
            src={zipIcon} />
        </a>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: white;
  border-radius: 20px;
  min-height: 70vh;
  text-align: center;
  padding-bottom: 20px;
  ${media.phone`
    font-size: 0.9em;
    min-height: 90vh;
  `};    
`

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user))
})

export default connect(mapStateToProps)(Welcome)
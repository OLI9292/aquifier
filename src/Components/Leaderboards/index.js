import { connect } from "react-redux"
import moment from "moment"
import React, { Component } from "react"
import _ from "underscore"
import { color } from "../../Library/Styles/index"
import get from "lodash/get"

import Dropdown from "../Common/dropdown"
import { fetchLeaderboardsAction } from "../../Actions/index"
import star from "../../Library/Images/star-yellow.png"
import { Container } from "../Common/container"
import Header from "../Common/header"
import { initials } from "../../Library/helpers"

import {
  DropdownContainer,
  LoadMoreButton,
  Rank,
  Row,
  Table,
  TableContainer
} from "./components"

class Leaderboards extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isWeekly: true,
      isClass: true,
      hideClass: false
    }
  }

  componentDidMount() {
    this.loadInitialLeaderboard(this.props.user)
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.loadedLeaderboard) {
      this.loadInitialLeaderboard(nextProps.user)
    }
  }

  loadInitialLeaderboard(user) {
    const userId = get(user, "_id")
    let classId = get(_.first(get(user, "classes")), "id")
    // HACK - so we can have multiple teachers for beach high
    const otherSavannahTeacherClassIds = [
      "5be46f4553ff7106fa41b84d",
      "5be4723f5ea72913024e8f05",
      "5be4723f5ea72913024e8f08",
      "5be472405ea72913024e8f0b",
      "5be472405ea72913024e8f0e",
      "5be472415ea72913024e8f11",
      "5be472415ea72913024e8f14",
      "5be472415ea72913024e8f17",
      "5be472415ea72913024e8f1a",
      "5be472415ea72913024e8f1d",
      "5be472415ea72913024e8f20",
      "5be472425ea72913024e8f23",
      "5be4725857748c13176d732e"
    ]
    if (otherSavannahTeacherClassIds.indexOf(classId) > -1) {
      // Ms Glovers class id
      classId = "5ba8e590815226002076e52e"
    }
    const isTeacher = get(user, "isTeacher") === true

    let query

    if (isTeacher && classId) {
      query = `classId=${classId}`
    } else if (userId && !this.state.loadedLeaderboard) {
      query = `userId=${userId}${classId ? `&classId=${classId}` : ""}`
    }

    if (query) {
      this.setState(
        {
          loadedLeaderboard: true,
          hideClass: !_.isString(classId),
          isClass: _.isString(classId)
        },
        () => this.loadLeaderboard(query)
      )
    }
  }

  loadLeaderboard(query) {
    this.props.dispatch(fetchLeaderboardsAction(query, this.props.session))
  }

  loadMore(ranks, isWeekly, direction) {
    const position =
      direction === "prev"
        ? Math.max((get(_.first(ranks), "rank") || 20) - 20, 1)
        : get(_.last(ranks), "rank")
    const query = isWeekly
      ? `position=${position}&isWeekly=true`
      : `position=${position}`
    this.loadLeaderboard(query)
  }

  highlight(userId) {
    const studentIds =
      this.props.isTeacher &&
      _.pluck(get(this.props.ranks, "weeklyClass"), "userId")
    return this.props.isTeacher
      ? !this.state.isClass && studentIds.includes(userId)
      : get(this.props.session, "user") === userId
  }

  render() {
    const { isWeekly, isClass, loadingMore, hideClass } = this.state

    const { ranks } = this.props

    const selectedRanks = (() => {
      switch (`${isWeekly}-${isClass}`) {
        case "true-true":
          return get(ranks, "weeklyClass")
        case "true-false":
          return get(ranks, "weeklyEarth")
        case "false-true":
          return get(ranks, "allTimeClass")
        default:
          return get(ranks, "allTimeEarth")
      }
    })()

    const row = (rank, idx) => (
      <Row key={idx} even={idx % 2 === 0}>
        <td style={{ width: "25%" }}>
          <Rank isUser={this.highlight(rank.userId)}>{rank.rank}</Rank>
        </td>
        <td
          style={{
            textAlign: "left",
            fontFamily: "BrandonGrotesque",
            color: color.gray2
          }}
        >
          <h3>
            {isClass
              ? `${rank.firstName} ${rank.lastName}`
              : initials(rank.firstName, rank.lastName)}
          </h3>
        </td>
        <td
          style={{
            textAlign: "left",
            fontFamily: "BrandonGrotesque",
            color: color.gray2
          }}
        >
          <h4>{!isClass && rank.school}</h4>
        </td>
        <td
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "70px"
          }}
        >
          <p style={{ fontSize: "1.1em", color: color.gray2 }}>{rank.points}</p>
          <img
            alt="star"
            style={{ height: "25px", margin: "0px 0px 4px 7px" }}
            src={star}
          />
        </td>
      </Row>
    )

    const loadMore = direction => {
      const hide =
        isClass ||
        (direction === "prev"
          ? _.contains(_.pluck(selectedRanks, "rank"), 1)
          : get(selectedRanks, "length") < 20)

      return (
        !_.isEmpty(selectedRanks) && (
          <LoadMoreButton
            onClick={() => this.loadMore(selectedRanks, isWeekly, direction)}
            loadingMore={loadingMore}
            hide={hide}
          >
            load more
          </LoadMoreButton>
        )
      )
    }

    const disclaimer = (
      <tr style={{ margin: "40px 0px" }}>
        <td>
          {`Score points to appear on the ${
            isWeekly ? "weekly " : ""
          }leaderboard.`}
        </td>
      </tr>
    )

    return (
      <Container>
        <Header.medium>leaderboards</Header.medium>

        <DropdownContainer>
          <Dropdown
            choices={hideClass ? ["Earth"] : ["My Class", "Earth"]}
            handleSelect={group =>
              this.setState({ isClass: group === "My Class" })
            }
            selected={isClass ? "My Class" : "Earth"}
          />
          <Dropdown
            choices={["Weekly", "All Time"]}
            handleSelect={period =>
              this.setState({ isWeekly: period === "Weekly" })
            }
            selected={isWeekly ? "Weekly" : "All Time"}
          />
        </DropdownContainer>

        <TableContainer>
          <Header.small style={{ paddingTop: "20px" }}>
            {isClass ? "my class" : "earth"}
          </Header.small>

          <p style={{ color: color.mediumLGray, fontSize: "0.8em" }}>
            {isWeekly
              ? moment()
                  .startOf("week")
                  .format("MMM Do YY") +
                " to " +
                moment()
                  .endOf("week")
                  .format("MMM Do YY")
              : "All Time"}
          </p>

          {loadMore("prev")}

          <Table>
            <tbody>
              {!_.isEmpty(selectedRanks)
                ? _.map(selectedRanks, (rank, idx) => row(rank, idx))
                : disclaimer}
            </tbody>
          </Table>

          {loadMore("next")}
        </TableContainer>
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user)),
  ranks: state.entities.ranks,
  isTeacher: get(state.entities.session, "isTeacher") === true
})

export default connect(mapStateToProps)(Leaderboards)

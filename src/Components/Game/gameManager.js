import moment from "moment"
import queryString from "query-string"
import Firebase from "../../Networking/Firebase"
import { connect } from "react-redux"
import React, { Component } from "react"
import { Redirect } from "react-router"
import _ from "underscore"
import get from "lodash/get"
import Socket from "../../Models/Socket"

import EloRating from "elo-rating"
import { shouldRedirect, mobileCheck } from "../../Library/helpers"

import {
  fetchQuestionsAction,
  fetchLevelsAction,
  removeEntityAction,
  saveStatsAction,
  saveLevelAction,
  saveQuestionAction
} from "../../Actions/index"

import Game from "./game"
import Intermission from "./Intermission/index"
import Bot from "../../Models/Bot"

class GameManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questionsAnswered: 0
    }
  }

  componentDidMount() {
    this.setState({ mobile: mobileCheck() })
    this.loadAllData(this.props.settings)
  }

  loadAllData(settingsQuery) {
    this.props.dispatch(removeEntityAction("questions"))

    const { user, levels } = this.props
    const settings = queryString.parse(settingsQuery)
    const notYetStarted = settings.type === "multiplayer"

    if (!levels.length) {
      this.props.dispatch(fetchLevelsAction())
    }

    this.setState(
      {
        settings: settings,
        type: settings.type,
        notYetStarted: notYetStarted,
        intermission: false,
        stats: null,
        questions: null,
        loadingQuestions: false,
        level: null
      },
      () => {
        if (settings.type === "demo" || settings.type === "korea-demo") {
          this.setupGame()
        } else if (user) {
          this.setupGame(user)
        } else {
          // TODO: - remove
          this.setupGame()
        }
      }
    )
  }

  componentWillReceiveProps(nextProps) {
    const { level, questions, settings } = this.state

    if (nextProps.questions.length && !questions) {
      console.log(nextProps.questions)
      this.setState({ questions: nextProps.questions })
    }

    if (nextProps.levels.length && !level && settings) {
      this.setLevelName(nextProps, settings)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)

    const { settings, gameOver, stats } = this.state
    const { session, user } = this.props

    if (settings.type === "multiplayer" && !gameOver) {
      this.exitMultiplayerGame(settings.id, user)
    }

    if (["demo", "korea-demo"].indexOf(settings.type) === -1 && !gameOver) {
      this.saveStats(session, stats)
    }
  }

  exitMultiplayerGame(accessCode, user) {
    Firebase.refs.games
      .child(accessCode)
      .child("players")
      .child(this.username(user))
      .remove()
  }

  emitScore(correct, progress) {
    if (!correct || get(this.props.opponent, "isBot")) {
      return
    }
    this.socket.updateScore(
      progress,
      this.state.settings.id,
      this.props.session.user
    )
  }

  recordQuestion(question, progress, correct, timeSpent, gameState) {
    if (this.state.type === "demo" || this.state.type === "korea-demo") {
      return
    }
    this.emitScore(correct, progress)

    const answeredAt = moment().format()
    const { hintCount, incorrectGuesses } = gameState
    const { word, type, level } = question
    const userId = get(this.props.session, "user")
    const sessionId = get(this.props.session, "sessionId")

    const data = {
      answered_at: answeredAt,
      answers: null,
      choices: null,
      correct: correct,
      mobile: this.state.mobile,
      hints_used: hintCount,
      incorrect_guesses: incorrectGuesses,
      session_id: sessionId,
      time_spent: timeSpent,
      type: type,
      user_id: userId,
      word: word
    }

    this.props.dispatch(saveQuestionAction(data))

    const stats = (this.state.stats || []).concat({
      word: word,
      correct: correct,
      difficulty: type,
      time: timeSpent,
      level: level
    })
    this.setState({ stats })
  }

  saveStats = async (session, stats, elo) => {
    const params = {
      id: get(session, "user"),
      stats: stats,
      platform: "web",
      elo: elo
    }
    return await this.props.dispatch(saveStatsAction(params, session))
  }

  setLevelName(props, settings) {
    const level = _.find(props.levels, l => l._id === settings.id)
    let time
    if (!level) {
      return
    }

    if (settings.type === "train") {
      level.fullname = level.name.toUpperCase() + " " + settings.stage
      level.progress = [parseInt(settings.stage, 10) || 1, level.progressBars]
    } else if (_.contains(["explore", "speed"], settings.type)) {
      level.fullname = level.slug.replace("-", " ").toUpperCase()
      time = parseInt(get(level.speed, "time") || 3, 10)
    }

    this.setState({ level: level, time: time })
  }

  gameOver = async (accuracy, score, time) => {
    const { settings, type, stats, oppProgress } = this.state

    // Return to home screen if demo
    if (type === "demo") {
      this.setState({ redirect: "/" })
      return
    } else if (type === "korea-demo") {
      this.setState({ redirect: "/korea-thank-you" })
      return
    }

    if (type === "battle") {
      const userWon = oppProgress !== 1
      const userElo = this.props.user.elo
      const opponentElo = this.props.opponent.elo
      const { playerRating } = EloRating.calculate(
        userElo,
        opponentElo,
        userWon
      )
      const battleResults = {
        userWon: userWon,
        userElo: userElo,
        newUserElo: playerRating,
        eloDiff: Math.abs(userElo - playerRating)
      }
      this.saveStats(this.props.session, stats, playerRating)
      this.setState({ intermission: true, battleResults: battleResults })
    }

    this.setState({ gameOver: true })

    // Save data and return to user home if train
    if (type === "train" || type === "speed") {
      const levelId = settings.id
      const stage = parseInt(settings.stage, 10)
      const userId = this.props.session.user
      const data = {
        accuracy: accuracy,
        levelId: levelId,
        score: score,
        stage: stage,
        time: time,
        type: type
      }

      await this.props.dispatch(saveLevelAction(data, userId))
      await this.saveStats(this.props.session, stats)
      this.setState({ intermission: true })
    }

    // Save score and redirect to leaderboard if multiplayer
    if (type === "multiplayer") {
      const username = this.username(this.props.user)
      Firebase.refs.games
        .child(settings.id)
        .child("players")
        .child(username)
        .set(score)
      const redirect = "/leaderboard/" + settings.id
      this.setState({ redirect })
    }
  }

  setupGame(user) {
    const { settings } = this.state

    if (settings.type === "multiplayer") {
      this.joinGame(settings, user)
    } else if (settings.type === "demo" || settings.type === "korea-demo") {
      this.loadQuestions({ type: settings.type })
    } else if (settings.type === "battle") {
      this.setupBattleGame(user, settings.id)
    } else {
      this.loadQuestions(_.extend({}, settings, { user_id: user._id }))
    }
  }

  setupBattleGame(user, room) {
    this.loadQuestions({
      type: "battle",
      user_id: user._id,
      questions_count: 15
    })

    if (get(this.props.opponent, "isBot")) {
      const bot = new Bot(15, this.props.username, this.props.opponent.elo)
      this.playBot(bot)
    } else {
      this.setupSocket(room, user._id)
    }
  }

  playBot(bot) {
    const duration = bot.randomSpeed()

    this.timeout = setTimeout(() => {
      bot.nextQuestion()
      const oppProgress = Math.min(bot.progress(), 1)
      this.setState({ oppProgress })
      if (oppProgress === 1) {
        setTimeout(() => this.gameOver(), 500)
      } else {
        this.playBot(bot)
      }
    }, duration)
  }

  setupSocket(room, userId) {
    this.socket = new Socket({ query: { userId: userId, room: room } })
    this.socket.registerHandler(this.onMessageReceived.bind(this))
  }

  onMessageReceived(message) {
    if (message.type !== this.socket.MESSAGE_TYPES.SCORE_UPDATE) {
      return
    }
    if (message.data.userId === this.props.session.user) {
      return
    }
    const oppProgress = message.data.progress
    this.setState({ oppProgress }, () => {
      if (oppProgress === 1) {
        this.gameOver(true)
      }
    })
  }

  loadQuestions(params) {
    if (params && !this.state.loadingQuestions) {
      this.setState({ loadingQuestions: true }, () => {
        const query = queryString.stringify(params)
        this.props.dispatch(fetchQuestionsAction(query))
      })
    }
  }

  username(user) {
    return `${get(user, "firstName")} ${get(user, "lastName")}`
  }

  joinGame = async (settings, user) => {
    const accessCode = settings.id
    const name = this.username(user)
    await Firebase.joinGame(name, accessCode)

    Firebase.refs.games.child(accessCode).on("value", snap => {
      const { players, end } = snap.val()
      const seed = snap.val().words
      const params = seed && {
        user_id: user._id,
        seed: seed,
        type: "multiplayer"
      }
      this.loadQuestions(params)

      const kicked = !_.includes(_.keys(players), name)
      const gameStarted = snap.val().status === 1

      if (kicked) {
        this.setState({ redirect: "/home" })
      } else if (gameStarted) {
        this.setState({ notYetStarted: false, end: end })
      }
    })
  }

  render() {
    if (shouldRedirect(this.state, window.location)) {
      return <Redirect push to={this.state.redirect} />
    }

    return this.state.intermission ? (
      <Intermission
        isBattle={this.state.battleResults !== undefined}
        battleResults={this.state.battleResults}
        loadAllData={settings => this.loadAllData(settings)}
        level={this.state.level}
        levels={this.props.levels}
        stats={_.filter(this.state.stats, stat => stat.correct)}
      />
    ) : (
      <Game
        factoids={this.props.factoids}
        gameOver={this.gameOver.bind(this)}
        imageKeys={this.props.imageKeys}
        level={this.state.level}
        mobile={this.state.mobile}
        end={this.state.end}
        battleUsernames={{
          user: get(this.props.user, "username"),
          opponent: get(this.props.opponent, "username")
        }}
        time={this.state.time}
        type={this.state.type}
        oppProgress={this.state.oppProgress || 0}
        notYetStarted={this.state.notYetStarted}
        questions={this.state.questions}
        recordQuestion={this.recordQuestion.bind(this)}
        originalQuestions={this.state.questions}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  imageKeys: _.values(state.entities.imageKey),
  user: _.first(_.values(state.entities.user)),
  opponent: state.entities.opponent,
  questions: _.values(state.entities.questions),
  factoids: _.values(state.entities.factoids),
  levels: _.values(state.entities.levels)
})

export default connect(mapStateToProps)(GameManager)

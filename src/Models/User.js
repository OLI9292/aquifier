import axios from 'axios';
import CONFIG from '../Config/main';

const href = `${CONFIG.ACCOUNTS_API}/user`

const saveStats = async (id, stats, wordList) => {
  try {
    return await axios.patch(href, {
      id: id,
      stats: stats,
      platform: 'web',
      wordList: wordList
    })
  } catch (error) {
    return { error: error.message }
  }
}

const User = {
  saveStats: saveStats
}

export default User;

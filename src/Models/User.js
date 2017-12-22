import axios from 'axios';

import CONFIG from '../Config/main';

const href = `${CONFIG.ACCOUNTS_API}/user`

const saveStats = (id, stats, wordList) => {
  try {
    const params = {
      id: id,
      stats: stats,
      platform: 'web',
      wordList: wordList
    }
    axios.patch(href, params);
  } catch (e) {
    console.log(e)
  }
}

const User = {
  saveStats: saveStats
}

export default User;

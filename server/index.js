import CONFIG from '../config/main'
'use strict';

const app = require('./app');

const PORT = CONFIG.PORT || 9000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

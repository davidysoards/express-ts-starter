import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import app from './app';

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

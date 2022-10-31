import app from './app';

if (!process.env.PORT) process.exit(1);

const port: number = parseInt(process.env.PORT as string, 10);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

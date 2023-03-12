import createApp from './app';

const PORT = Number(process.env.PORT) || 3000;

createApp()
  .then((app: { listen: (arg0: number) => void; }) => {
    // use app to do other express related configs here
    app.listen(PORT);
  })
  .then(() => {
    console.log(`Server started on port ${ PORT }...`);
  })
  .catch(err => {
    console.error('Caught an error', err);
  });
# contactful

A port of the excellent [mira](https://github.com/thesephist/mira) from its original python + custom frontend to a stack I can maintain in typescript + node + react and designed to run on [Deta Space](https://deta.space/) (and/or Deta Cloud).

## Development

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

You will need to create a `.env.local` file with a `DETA_PROJECT_KEY` entry for the
local backend to persist to a real Deta Store.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` and `micro` folders.\
Run this before doing your `deta deploy`.

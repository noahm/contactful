# contactful

A port of the excellent [mira](https://github.com/thesephist/mira) from its original python + custom frontend to a stack I can maintain in typescript + node + react and designed to run on [Deta Space](https://deta.space/) (and/or Deta Cloud).

## Development

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode with live reloading of both the front and back end.

You will need to create a `.env.local` file with a `DETA_PROJECT_KEY` entry for the
local backend to talk to a real Deta Store.

### `yarn test`

Launches the unit tests in watch mode. (No real tests written yet.)

### `yarn build`

Builds the app for production into the `build` and `micro` folders.

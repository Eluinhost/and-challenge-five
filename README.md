# AND Challenge 5

This is a WebVR/XR app available at https://eluinhost.github.io/and-challenge-five/

Tested in Firefox with Valve Index + Controllers, as well as in Chrome with mouse + keyboard

Chrome works fine in non-VR but needed to be ran in non-sandboxed mode + a beta version to get VR working where the
controller support was very broken. It does appear to have MUCH better performance though, running at the full 144fps
vs 60-80 in Firefox :'(

Seems like a lot of things can/will be broken based on the browser's support for WebVR vs newer WebXR spec

## 'Game' instructions

This is a knockoff minesweeper clone built with A-Frame with an experimental version of React using some experimental
APIs for VR support

Flag all mines + check all tiles to unlock the exit, move the robot there to win. Walking over a mine will cause you to
lose the game.

The default map is the one from the challenge, the RESET button generates a new random sized map with a random number of mines (and possibly in a non-winning layout with mines blocking the exit 🤔)

-   Can cycle flags on a tile with trigger/mouse click
-   Can move robot with thumbstick/arrow keys
-   Can check tile the robot is on with `A` button/space key
-   `F` enters VR mode, `Esc` will quit out of it
-   `W`,`S`,`A`,`D` + click and drag can move the camera in non-VR mode

### Gifs

'Winning' the default map from the challenge

![Winning Gif](./winning.gif)

'Losing' a random map

![Losing gif](./losing.gif)

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

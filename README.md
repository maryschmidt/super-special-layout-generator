# (Super Special Layout Generator)[https://super-special-layout-generator.web.app/]
This is a tool to help folks generate layouts for given battery configurations. They need to be able to 
1. Determine the resulting budget, land size, and energy requirements
2. View a mock site layout complete with the number of transformers that would be required
3. Save and resume their sessions across cache clears (thus, we aren't using localstorage)

## Design Decisions
The goal was to make this as simple as possible as a tech demo, but also provide something with potential to scale.

For the layout, this led to a simple input on the left, output viz on the right situation.

The calculated results from the input are co-located with them.

## Architecture
Tech stack
- Vite
- React
- Typescript
- React Router
- Firebase (quick to get started and host, persistent data made easy)
    - Realtime Database because it's tried and true & this is not a mobile application
    - Drop in UI library for speed of development
    - Longer term we could implement (offline persistence)[https://firebase.google.com/docs/database/web/offline-capabilities]
- Material UI for the UI toolkit (fast, standard, familiar aesthetic)

## Notes
- Runs on port `8000` locally.
- Authentication and persistence are handled through Firebase Realtime Database
- MUI `Box` component is not performant but it sure is quick to prototype with

## Future Work
- Refactor code (seriously... move the viz into its own area of concern for one thing)
- Visuals in general need a lot of work
- Success/error messaging is not present at the moment (no indication that save succeeded for example)
- Take control of auth UX
- Analytics and telemetry
- A/B testing
- Ability to manage multiple builds at once (support users having multiple open build sessions at once)
- Enable more authentication providers (built in to Firebase, easy to add. Docs available [here](https://firebase.google.com/docs/auth/web/firebaseui))
- Create an error page for routes not found (`errorElement: <ErrorPage />,`)
- fix: When the height of the viz is greater than the visible container height, the scrollbar position affects the calculated footprint width
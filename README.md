# (Super Special Layout Generator)[https://super-special-layout-generator.web.app/]
This is a tool to help folks generate layouts for given battery configurations. They need to be able to 
1. Determine the resulting budget, land size, and energy requirements
2. View a mock site layout complete with the number of transformers that would be required
3. Save and resume their sessions across cache clears (thus, we aren't using localstorage)

## Design Decisions

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
- Authentication and persistence are handled through Firebase

## TODO
- Security for the data -- this should be defined in `database.rules.json`.
- Take control of auth UX
- Analytics and telemetry
- A/B testing
- Ability to manage multiple builds at once (support users having multiple open build sessions at once)
- Enable more authentication providers (built in to Firebase, easy to add. Docs available [here](https://firebase.google.com/docs/auth/web/firebaseui))
- Create an error page for routes not found (`errorElement: <ErrorPage />,`)
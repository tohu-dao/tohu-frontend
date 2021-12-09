# [Exodia Frontend](https://app.exodia.fi/)
This is the front-end repo for Exodia that allows users be part of the future of Greece. 

**_ Note We're currently in the process of switching to TypeScript. Please read  this  guide on how to use TypeScript for this repository. https://github.com/OlympusDAO/olympus-frontend/wiki/TypeScript-Refactor-General-Guidelines _**

##  🔧 Setting up Local Development

Required: 
- [Node v14](https://nodejs.org/download/release/latest-v14.x/)  
- [Yarn](https://classic.yarnpkg.com/en/docs/install/) 
- [Git](https://git-scm.com/downloads)


```bash
$ git clone --recurse-submodules https://github.com/ExodiaFinance/exodia-frontend
$ cd olympusdao

# set up your environment variables
# read the comments in the .env files for what is required/optional
$ cp .env.example .env

# fill in your own values in .env, then =>
$ yarn
$ yarn start
```

The site is now running at `http://localhost:3000`!
Open the source code and start editing!

## Testing

You can test the deployed version by doing `docker-compose up --build`

**Faucets**
TODO

## Architecture/Layout
The app is written in [React](https://reactjs.org/) using [Redux](https://redux.js.org/) as the state container. 

The files/folder structure are a  **WIP** and may contain some unused files. The project is rapidly evolving so please update this section if you see it is inaccurate!

```
./src/
├── App.jsx       // Main app page
├── abi/          // Contract ABIs from etherscan.io
├── actions/      // Redux actions 
├── assets/       // Static assets (SVGs)
├── components/   // Reusable individual components
├── constants.js/ // Mainnet Addresses & common ABI
├── contracts/    // TODO: The contracts be here as submodules
├── helpers/      // Helper methods to use in the app
├── hooks/        // Shared reactHooks
├── themes/       // Style sheets for dark vs light theme
└── views/        // Individual Views
```

## Application translation

Olympus uses [linguijs](https://github.com/lingui/js-lingui) to manage translation.

The language files are located in a submodule deployed in `src/locales/translations`. This submodule points to the [olympus translation repository](https://github.com/OlympusDAO/olympus-translations)

For the translations to run locally, you must pull the submodlue and compile the translations:
```
git submodule update --init --recursive
yarn lingui:extract
yarn lingui:compile
```

In order to mark text for translation you can use:
- The <Trans> component in jsx templates eg. `<Trans>Translate me!</Trans>`
- The t function in javascript code and jsx templates. ``` t`Translate me` ```
You can also add comments for the translators. eg.
```
t({
	id: "do_bond",
	comment: "The action of bonding (verb)",
})
```


When new texts are created or existing texts are modified in the application please leave a message in the OlympusDao app-translation channel for the translators to translate them.

## 👏🏽 Contributing Guidelines 

You can view a list of planned feature on our [Kanban](https://trello.com/b/yiB0y4qD/exodia-contributors). 
Ask @HOVOH on Discord to give you an invite link if you want to get involved.

*__NOTE__*: For big changes associated with feature releases/milestones, they will be merged onto the `develop` branch for more thorough QA before a final merge to `master`


**Defenders of the code**: 

Only the following people have merge access for the master branch. 
* [@HOVOH](https://github.com/hovoh)


## 🗣 Community

* [Join our Discord](https://discord.gg/exodia) and ask how you can get involved with the DAO!


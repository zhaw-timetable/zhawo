<p align="center">
  <a href="https://travis-ci.org/zhaw-timetable/zhawo" target="_blank">
  <img src="https://travis-ci.org/zhaw-timetable/zhawo.svg?branch=master" />
  </a>
  <a href="https://codecov.io/gh/zhaw-timetable/zhawo" target="_blank">
  <img src="https://codecov.io/gh/zhaw-timetable/zhawo/branch/master/graph/badge.svg" />
  </a>
  <a href="https://github.com/prettier/prettier" target="_blank">
  <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" />
  </a>
</p>
    <hr>
  <p align="center">
  <img src="docs/assets/logo_readme.png?raw=true" height="200" width="200" />
</p>

<hr>

## About

Our vision for **zhawo** is to build a modern progressive web app to help students of the ZHAW with their every day study needs. Using agile development, the goal is to work closely with students to provide an application that is tailored to their specific needs.

A few features that we are planning to implement:

- Timetable: students often need to quickly check what courses they have next and where they need to go. The availability of this feature is very important and has been noted as being an issue with the "official" timetable app. Using intelligent caching and a modern user interface, we aim to improve this aspect.

- Room search: when we first started there was an application, that allowed students to search for free rooms all over their campus. This was very useful as study programmes at the ZHAW put a huge focus on group projects, but with limited quiet public working spaces, finding a free room was often vital. The app that only ever existed for Android devices has since completely disappeared.

- Menu plans: There are menu plans on the official provider of the mensa food's website. However, this site is rather unknown and we plan to include an easy way to check today's and upcoming menus and prices.

- Student events: We plan to work with vszhaw to bring more attention to student parties and events, by integrating their event feed into zhawo.

<hr>

## Development

This project is split up into a backend Node service (`./source/backend`) and a frontend progressive web app built with React (`./source/frontend`). For development, please refer to the respective readmes.

There is an npm script provided in the root folder of this repository to start both backend and frontend concurrently. Note that this script only works if all dependencies have been installed.

```
# Install concurrently module:
  npm install

# Install dependencies for both frontend and backend:
  npm run install-both

# Run tests for both frontend and backend:
  npm run test-both

# Run backend and frontend for development:
  npm start
```

Both backend and frontend are JavaScript stacks. We are using Flow.js for static type checking. For continous integration we are using Travis CI. For test coverage we are using Codecov. We enforce a consistent coding style with prettier pre-commit hooks.

<hr>

## Workflow

Product backlog is managed with GitHub issues. All user stories must be labeled correctly with story points. Sprint Planning is done using the GitHub Projects board. For each Sprint, a new Project is added with 3 boards for `ToDo`, `In Progress` and `Done`.

When working on a feature/user story, the developer assigns himself to the issue and moves it from `ToDo` to `In Progress`. Each developed feature is initially on it's own feature branch. The branch is to follow the following naming convention: `feature/{descriptive-name}`. If development of a feature is complete, a pull request onto the `master` branch is made and the code reviewed by a team member whenever possible. After being reviewed the branch can be merged into the `master` branch and the issue can be moved to `Done` on the Sprint board.

<hr>

## Sprint Planning

**Sprint 2 (Thu 18 Oct - Thu 1 Nov 2018)**

_work in progress_

**Sprint 1 (Thu 4 Oct - Thu 18 Oct 2018)**

_to be reviewed_

<hr>

## Product Backlog

_work in progress (see issues labeled `user story` for now)_

<hr>

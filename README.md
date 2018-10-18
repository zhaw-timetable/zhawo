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
# Install concurrently module

  npm install

# Run backend and frontend concurrently

  npm start
```

Both backend and frontend are JavaScript stacks. We are using Flow.js for static type checking. For continous integration we are using Travis CI. For test coverage we are using Codecov. We enforce a consistent coding style with prettier pre-commit hooks.

<hr>

## Workflow

_work in progress_

<hr>

## Sprint Planning

**Sprint 1 (Thu 4 Oct - Thu 18 Oct 2018)**

_work in progress_

<hr>

## User Stories

_work in progress_

<hr>

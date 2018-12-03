<p align="center">
  <a href="https://travis-ci.org/zhaw-timetable/zhawo" target="_blank"><img src="https://travis-ci.org/zhaw-timetable/zhawo.svg?branch=master" /></a>
  <a href="https://codecov.io/gh/zhaw-timetable/zhawo" target="_blank"><img src="https://codecov.io/gh/zhaw-timetable/zhawo/branch/master/graph/badge.svg" /></a>
  <a href="https://github.com/prettier/prettier" target="_blank"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" /></a>
</p>
    <hr>
  <p align="center">
  <img src="docs/assets/logo_readme.png?raw=true" height="200" width="200" />
</p>

<hr>

## Content

- [About](#about)
- [Development](#development)
- [Workflow](#workflow)
- [Sprint Planning](#sprint-planning)
  - [Sprint 5](#sprint-5)
  - [Sprint 4](#sprint-4)
  - [Sprint 3](#sprint-3)
  - [Sprint 2](#sprint-2)
  - [Sprint 1](#sprint-1)
  - [Sprint 0](#sprint-0)
- [Product Backlog](#product-backlog)

<hr>

## About

Our vision for **zhawo** is to build a modern progressive web app to help students of the ZHAW with their every day study needs. Using agile development, the goal is to work closely with students to provide an application that is tailored to their specific needs.

A few features that we are planning to implement:

- Timetable: students often need to quickly check what courses they have next and where they need to go. The availability of this feature is very important and has been noted as being an issue with the "official" timetable app. Using intelligent caching and a modern user interface, we aim to improve this aspect.

- Room search: when we first started there was an application, that allowed students to search for free rooms all over their campus. This was very useful as study programmes at the ZHAW put a huge focus on group projects, but with limited quiet public working spaces, finding a free room was often vital. The app that only ever existed for Android devices has since completely disappeared.

- Menu plans: There are menu plans on the official provider of the mensa food's website. However, this site is rather unknown and we plan to include an easy way to check today's and upcoming menus and prices.

- Student events: We plan to work with vszhaw to bring more attention to student parties and events, by integrating their event feed into zhawo.

[Back to top](#content)

<hr>

## Development

This project is split up into a backend Node service (`./source/backend`) and a frontend progressive web app built with React (`./source/frontend`). For development, please refer to the respective readmes.

There is an npm script provided in the root folder of this repository to start both backend and frontend concurrently. Note that this script only works if all root dependencies have been installed.

```
# Install root dependencies:
  npm install

# Install dependencies for both frontend and backend:
  npm run install-both

# Run backend and frontend for development:
  npm run start-both

# Run tests for both frontend and backend:
  npm run test-both
```

Both backend and frontend are JavaScript stacks. For continous integration we are using Travis CI. For test coverage we are using Codecov. We enforce a consistent coding style with prettier pre-commit hooks.

[Back to top](#content)

<hr>

## Workflow

Product backlog is managed with GitHub issues. All user stories must be labeled correctly with story points. Sprint Planning is done using the GitHub Projects board. For each Sprint, a new Project is added with 3 boards for `ToDo`, `In Progress` and `Done`.

When working on a feature/user story, the developer assigns himself to the issue and moves it from `ToDo` to `In Progress`. Each developed feature is initially on it's own feature branch. The branch is to follow the following naming convention: `feature/{descriptive-name}`. If development of a feature is complete, a pull request onto the `master` branch is made and the code reviewed by a team member whenever possible. After being reviewed the branch can be merged into the `master` branch and the issue can be moved to `Done` on the Sprint board.

[Back to top](#content)

<hr>

## Sprint Planning

### Sprint 5

**(Thu 29 Nov - Thu 13 Nov 2018)**

#### Goals

Finish Menuplan Navigation, clean up code, increase test coverage

#### User stories

- [ ] **3 SP** US36 - As a user I want to filter my search to only show rooms that are unoccupied for at least x hours/minutes
- [ ] **1 SP** US52 - As a user I want to navigate to the mensa menu of the current day
- [ ] **2 SP** US53 - As a user I want to navigate between days when using the mensa menu day view
- [ ] **2 SP** US57 - As a user I want to navigate between menus of different days

#### Decisions

...

#### Review

...

#### Burndown

<img src="docs/burndown/burndown_sprint_5-001.jpg?raw=true" height=400 />

<hr>

### Sprint 4

**(Thu 15 Nov - Thu 29 Nov 2018)**

#### Goals

Finish PWA offline features, fix bugs, implement room search functionality and start mensa functionality

#### User stories

- [x] **3 SP** US02 - As a user I want the app to work even when I dont have network connection
- [ ] **3 SP** US36 - As a user I want to filter my search to only show rooms that are unoccupied for at least x hours/minutes
- [x] **1 SP** US56 - As a user I want to see prices for all menus
- [x] **4 SP** US58 - As a user I want to view a specific mensas menu plan
- [x] **8 SP** US30 - As a user I want to find currently unoccupied rooms

#### Decisions

- Due to the many asynchronous calls that are required for getting list of unoccupied rooms, it will be done in an interval and the results will be cached. Instead of creating list of free rooms directly after user request.

#### Review

The goal of finishing PWA offline features and implementing a prototypical version of the roomsearch were met. Mensa functionality is done and only has to be extended by navigation and better presentation in the UI. The user story that could not be implemented in this sprint is also due to the fact that we have postponed refining the user interface for the room search and put focus on background functionality first. The velocity will be reduced in Sprint 5 to put some more focus on reviewing design choices, increasing stability and increasing test coverage, since it will be the final Sprint of this stage of the project.

#### Burndown

<img src="docs/burndown/burndown_sprint_4-001.jpg?raw=true" height=400 />

<hr>

### Sprint 3

**(Thu 1 Nov - Thu 15 Nov 2018)**

#### Goals

Finish and improve timetable features, start implementing room search functionality

#### User stories

- [ ] **3 SP** US02 - As a user I want the app to work even when I dont have network connection
- [x] **5 SP** US11 - As a user I want to view my timetable for a week
- [x] **3 SP** US15 - As a user I want to navigate to a specific date in the month view
- [x] **1 SP** US20 - As a user I want to have a detailed view of my events
- [ ] **4 SP** US30 - As a user I want to find currently unoccupied rooms

#### Decisions

- Swipe User Interactions will have lower priority than getting planned functionality implemented as least as prototype

#### Review

The velocity suffered a bit toward the end of the sprint. From the two user stories that could not get finished, US02 is 80% done. US30 was underestimated and has been adjusted to 8 SP in the next sprint. Other than that, no major changes are needed.

#### Burndown

<img src="docs/burndown/burndown_sprint_3-001.jpg?raw=true" height=400 />

<hr>

### Sprint 2

**(Thu 18 Oct - Thu 1 Nov 2018)**

#### Goals

Complete navigation in timetable. Load timetable for more than current week. Add timetable search for classes, courses, rooms and other people.

#### User stories

- [ ] **5 SP** US11 - As a user I want to view my timetable for a week
- [x] **1 SP** US12 - As a user I want to navigate to the current day
- [x] **2 SP** US14 - As a user I want to navigate between weeks
- [ ] **1 SP** US20 - As a user I want to have a detailed view of my events
- [x] **2 SP** US16 - As a user I want to view a specific rooms timetable
- [x] **2 SP** US17 - As a user I want to view a specific classes timetable
- [x] **2 SP** US18 - As a user I want to view a specific courses timetable
- [x] **2 SP** US19 - As a user I want to view another persons timetable
- [ ] **3 SP** US15 - As a user I want to navigate to a specific date in a month view

#### Decisions

- Deploy build to heroku for testing of PWA features and getting customer feedback fast
- Add pre commit checks for test success to improve general quality of commits and reduce bugs and errors introduced (even on feature branches)
- Use material-ui framework for common UI elements such as app bar, navigation, menu, buttons etc. to reduce workload

#### Review

The main goals were achieved. We went from 12 story points in sprint 1 to 20 in this sprint. We expected to not be able to completely implement all the planned user stories. However, both US11 and US15 have been implemented as prototypes that mainly need to be integrated into the updated design. The transition from our own design to using the material-ui framework took a lot of time. In general, we are happy with the progress made in this sprint. A large chunk of the product backlog has been implemented. Only 3 planned user stories for the timetable part of the application remain.

#### Burndown

<img src="docs/burndown/burndown_sprint_2-001.jpg?raw=true" height=400 />

<hr>

### Sprint 1

**(Thu 4 Oct - Thu 18 Oct 2018)**

#### Goals

Implement timetable for one user for one day, set up app components such as app bar and navigation

#### User stories

- [x] **3 SP** US01 - As a user I want to save my credentials/username
- [x] **2 SP** US03 - As a user I want to switch between contexts (settings, timetable, menu, zhawo, vszhaw)
- [x] **5 SP** US10 - As a user I want to view my timetable for a day
- [x] **2 SP** US13 - As a user I want to navigate between days when using the day view

#### Decisions

- Users do not need to set up an account for easy access. Setting a default ZHAW name should be enough for the current functionality. May be extended if features require an account (f. ex. editing and extending timetable with notes)
- Agreed on git workflow with feature branch naming to avoid confusing branch names
- Only merge into master if Travis build is successful
- Remove Flow type system as it is not well implemented in our IDEs of choice and sometimes hard to work with in combination with React and flux

#### Review

All goals were met in this sprint. We don't need to change anything. We managed to implement all 12 planned story points. Will try to get more storypoints done in next sprint.

#### Burndown

<img src="docs/burndown/burndown_sprint_1-001.jpg?raw=true" height=400 />

<hr>

### Sprint 0

**(Thu 4 Oct - Thu 18 Oct 2018)**

#### Goals

Set up development environment & continuous integration, decide on requirements, create and estimate user stories, set up github projects and issues, decide on workflow

#### Decisions

- Use React with flux pattern for frontend
- Frontend communicates with own backend for access to CampusInfo API because it requires a custom User-Agent in the HTTP Header (not allowed in modern browsers for security reasons)
- Use PWA technologies for caching and cross-platform app installation
- Use node.js express server in backend to relay communication with CampusInfo API and maybe track users, activity
- Set up and decide on database architecture only once it's needed
- Use prettier commit hooks to enforce coding style
- Use Travis CI and codecov for continuous integration and test coverage reports
- Use Flow types for type checking in both frontend and backend

[Back to top](#content)

<hr>

## Product Backlog

_(see issues labeled `user story`)_

[Back to top](#content)

<hr>

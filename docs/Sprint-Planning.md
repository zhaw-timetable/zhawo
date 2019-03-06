# Sprint Planning

## Content

- [Sprint Planning](#sprint-planning)
  - [Sprint 5](#sprint-5)
  - [Sprint 4](#sprint-4)
  - [Sprint 3](#sprint-3)
  - [Sprint 2](#sprint-2)
  - [Sprint 1](#sprint-1)
  - [Sprint 0](#sprint-0)
- [Product Backlog](#product-backlog)

<hr>

### Sprint 5

**(Thu 29 Nov - Thu 20 Dec 2018)**

#### Goals

Write Documentation, Refactoring, Improve Test Coverage

#### Decisions

- Decided to not implement any more features in this final sprint, instead focusing on writing documentation (Projektarbeit Bericht), refactoring and test coverage improvements
- Sprint is extended by one week because of end of semester milestone

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

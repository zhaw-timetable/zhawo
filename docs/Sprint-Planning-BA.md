# Sprint Planning BA

## Content

- [Sprint Planning](#sprint-planning)
  - [Sprint 2](#sprint-2)
  - [Sprint 1](#sprint-1)
  - [Sprint 0](#sprint-0)
- [Product Backlog](#product-backlog)

<hr>

### Sprint 2

**(Thu 21 Mar - Thu 4 Apr 2019)**

#### Goals

Create floor plan SVGs and basic interaction with campus and building floor plans. Add swipe gesture navigations.

#### User stories

- [ ] **3 SP** Task - Improve front end testing
- [ ] **1 SP** Task - Save view state to indexed db
- [ ] **1 SP** Task - ScheduleSearch: Filter out own name (login name) from suggestions
- [ ] **6 SP** US31 - As a user I want a floor plan of each floor per building with highlighted unoccupied rooms
- [ ] **10 SP** US32 - As a user I want an overview of my campus with highlighted buildings where there are unoccupied rooms

#### Decisions

- ...

#### Review

...

#### Burndown

<img src="burndown/burndown_sprint_2_ba_001.jpg?raw=true" height=400 />

<hr>

### Sprint 1

**(Thu 7 Mar - Thu 21 Mar 2019)**

#### Goals

Create floor plan SVGs and basic interaction with campus and building floor plans. Add swipe gesture navigations.

#### User stories

- [x] **3 SP** Task - Add swipe gestures to Schedule
- [x] **2 SP** US57 - As a user I want to navigate between menus of different days
- [x] **1 SP** US52 - As a user I want to navigate to the mensa menu of the current day
- [x] **4 SP** US33 - As a user I want to navigate between buildings from the overview of my campus
- [x] **4 SP** US34 - As a user I want to navigate between floor plans of a building

#### Decisions

- No animations when navigating through swipe
- For vszhaw news feed, only a content snipped is enough, click on story redirects to article on vszhaw.ch
- When switching back, view state should stay on f. ex. vszhaw and not go back to the default schedule view (Added task in next sprint)

#### Review

Planned user stories could be implemented. Some time was also used for design reworks not reflected in story points. Nothing needs to be changed.

#### Burndown

<img src="burndown/burndown_sprint_1_ba_001.jpg?raw=true" height=400 />

<hr>

### Sprint 0

**(Thu 21 Feb - Thu 7 Mar 2019)**

#### Goals

Decide on further planning, establish procedure to create SVGs for rooms, research frameworks/technologies for gestures and animations, establish concept for bachelor thesis

#### Decisions

- Bachelor thesis will cover our assessment of the advantages and disadvantages of a progessive web apps compared to native apps both in development and user experience
- Animation will be done with react-pose
- Swipe navigation between different timetables will be done with react-easy-swipe
- No SVGs are available of floors, need to create them ourselves based on ZHAW Speedikonsp plans
- Need ZHAW server for deployment, need to buy domain name

[Back to top](#content)

<hr>

## Product Backlog

_(see issues labeled `user story`)_

[Back to top](#content)

<hr>

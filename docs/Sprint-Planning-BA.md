# Sprint Planning BA

## Content

- [Sprint Planning](#sprint-planning)
  - [Sprint 4](#sprint-4)
  - [Sprint 3](#sprint-3)
  - [Sprint 2](#sprint-2)
  - [Sprint 1](#sprint-1)
  - [Sprint 0](#sprint-0)
- [Product Backlog](#product-backlog)

<hr>

### Sprint 4

**(Thu 18 Apr - Thu 3 May 2019)**

#### Goals

Set up domain, fix bugs in roomsearch, various enhancements

#### User stories

- [ ] **4 SP** US - As a user I want to see upcoming vszhaw events (f.ex. next party)
- [ ] **1 SP** Task - Set up domain name for ZHAW prod serverr
- [ ] **1 SP** US35 - As a user I want to see until when a room is unoccupied
- [ ] **3 SP** US36 - As a user I want to filter my search to only show rooms that are unoccupied for at least x hours/minutes

#### Decisions

- ...

#### Review

...

<hr>

### Sprint 3

**(Thu 4 Apr - Thu 18 Apr 2019)**

#### Goals

Finish RoomSearch Interface, set up server, rework design

#### User stories

- [x] **1 SP** Task - Display bug when clicking on an event
- [x] **1 SP** Task - Can't type full name and hit enter in Login/Search inputs
- [x] **1 SP** Task - Schedule resets to users Schedule when Search Schedule is started before all async requests for currentUser are done
- [x] **3 SP** Task - Rework application design, color palette
- [x] **2 SP** Task - Dispay of overlapping events doesnt always work correctly
- [x] **4 SP** Task - Set up ZHAW production server
- [ ] **1 SP** US35 - As a user I want to see until when a room is unoccupied
- [ ] **3 SP** US36 - As a user I want to filter my search to only show rooms that are unoccupied for at least x hours/minutes

#### Decisions

- Removed user story for Month navigation in Menuplan -> does not make much sense to provide navigation far back and ahead

#### Review

Tasks and bugfixes could be implemented. ZHAW production server was set up and should allow us to more easily distribute and collect feedback for application (no 30 second delay to wake up from sleep). There is a bug/inconsitencies with SVG floorplans -> 2 related userstories will only be marked completed in next sprint when issues are resolved, but are mostly done.

<hr>


### Sprint 2

**(Thu 21 Mar - Thu 4 Apr 2019)**

#### Goals

Improve test coverage, create SVGs of floorplans and display unoccupied rooms, minor enhancements

#### User stories

- [x] **3 SP** Task - Improve front end testing
- [x] **1 SP** Task - Save view state to indexed db
- [x] **1 SP** Task - ScheduleSearch: Filter out own name (login name) from suggestions
- [x] **6 SP** US31 - As a user I want a floor plan of each floor per building with highlighted unoccupied rooms
- [x] **10 SP** US32 - As a user I want an overview of my campus with highlighted buildings where there are unoccupied rooms

#### Decisions

- Burndown charts will not be added to the repository for future sprints, since focus will be more on deployment and bug fixes / enhancements

#### Review

Planned userstories could be implemented. No changes to approach necessary. Since most important user stories from vision are implemented / planned, we will switch to more tasks and enhancements in future sprints.

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

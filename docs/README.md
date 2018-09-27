### TODOs

- frontend PWA (Service worker, manifest.json)
- user stories, sprint planning, burn down chart, github project, wiki
- Design mockups etc.
- backend Jest setup
- Mensa API? Web scraping?
- Room plans? etc for ZHAWO
- check with other schools?
- VSZHAW rss feed -> https://www.vszhaw.ch/feed/
- Section Links f.ex: pass.zhaw.ch (mobile printing etc)
- write READMES, guides how to run stuff

### User Stories Brainstorm

As a user...

[General]

... I want to save my credentials

... I want the app to work even when I dont have network connection

...

[Timetable]

... I want to view my timetable for a week

... I want to view my timetable for a day

... I want to navigate to the current day

... I want to navigate between days when using the day view

... I want to navigate between weeks when using the week view

... I want to navigate to specific date in a month view

... I want to have a detailed view of my events

... I want to view another persons timetable

... I want to view a specific rooms timetable

... I want to view a specific classes timetable

... I want to view a specific courses timetable

... I want to see the room for my events

...

[Zhawo]

... I want to find currently unoccupied rooms

... I want to view an overview of my campus with highlighted buildings where an unoccupied room exists

... I want to view a floor plan of each floor for each building on my campus with highlighted unoccupied rooms

... I want to navigate between buildings from the overview of my campus

... I want to navigate between floor plans of a building

... I want to see until when a room is unoccupied

... I want to filter my search to only show rooms that are unoccupied for at least x hours/minutes

...

[Menu/Mensa]

... I want to view the mensa menu for my campus for a day

... I want to view the mensa menu for my campus for a week

... I want to navigate to the current day

... I want to navigate between days when using the day view

... I want to navigate between weeks when using the week view

... I want to navigate to specific date in a month view

... I want to see prices for all menus

... I want to navigate between menus of different days

... I want to view a specific mensas menu plan

...

[VSZhaw]

... I want to view view vszhaw blog posts and event announcements

...

[Settings]

...

**git / github**

```
# Squash last X commits
  git reset --soft HEAD~12
  git commit -m "Commit message.."

# Apply gitignore to already tracked
  git rm -r --cached .
  git add .
  git commit -m "Applied gitignore to tracked files"
```

**curl / api**

```
# Basic syntax (run with bash / Git bash )
  curl -d '{"hello": "world"}' -H "Content-Type: application/json" -X POST url:8080/res

  curl -d '{"userName": "bachmdo2", "startDate": "27-09-2018"}' -H "Content-Type: application/json" -X POST localhost:4000/username
```

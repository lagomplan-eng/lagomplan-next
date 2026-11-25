# /experiencias and /hoteles on the home-based foundation

`before/` = main, `after/` = this branch, at 1440 and 390, for the two pages and for one-destination states; `after/*-sheet-390.jpg` is the new mobile filter sheet. `index.html` shows everything.

Lists are grouped by destination (one header card per destination with its illustration, that destination's items below, destinations in guide order).

GA4: the same interaction script (filters set and cleared, destination search, book, guide, planner clicks) was run on main and on this branch at 1440 and 390 with `window.gtag` stubbed: the captured events and params are identical, in the same order.

The comparison also clicks an experience (40th) and a hotel (91st) deep in the list: the `position` reported is the same on main and on this branch.

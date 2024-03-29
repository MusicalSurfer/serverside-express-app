# EFT Ballistics 
**This webpage is a resource of information for Escape From Tarkov players that need more details on a ballistics in the game. This is a fullstack project that is deployed on Render.**

### Features

- All data is hosted via postgreSQL.
  
- Various calibers to explore as well as their associated rounds.

### External Sources

- Bootstrap was used for some styling

- Several google fonts are used.

- Express, pg, and dotenv libraries are used.

### Usage

1. Glone project via git link and use npm install to install dependencies.

2. Web API end points are as follows:
  GET -/ = Displays home page.
  GET -/eft/ballistics = Display all calibers
  GET -/eft/ballistics/caliber/CALIBER_ID = Input caliber id to see all rounds of that caliber
  PATCH -/eft/ballistics/caliber/CALIBER_ID Input caliber id to update a existing caliber ({name})
  PATCH -/eft/ballistics/round/ROUND_ID Input round id to update a existing round  ({name, dmg, caliber_id, penetration})
  POST -/eft/ballistics/caliber Input ({name}) in request body to add a new caliber.
  POST -/eft/ballistics/round Input ({name, dmg, caliber_id, penetration}) in request body to add a new round.
  DELETE -/eft/ballistics/caliber/CALIBER_ID Input caliber id to delete caliber.
  DELETE -/eft/ballistics/round/ROUND_ID Input round id to delete round.

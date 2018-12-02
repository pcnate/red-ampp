# RED-AMPP

Developer tool for running micro services behind a redbird proxy. Some CLI tools like Angular already provide a proxy mechanism. This one attempts to seperate from the source and provide more extensive abilities

>__WARNING:__
>
>This is only meant to run as a development tool on localhost. Using it as a web facing tool is not recommended at this time


## Current Setup

 * `npm install -g red-ampp`
 * `red-ampp`

## Example

  | Source                  |     | Destination                 |
  | ----------------------- | --- | --------------------------- |
  | http://localhost/api    | --> | http://localhost:3000/api   |
  | http://localhost/       | --> | http://localhost:4200       |
  | http://localhost/other  | --> | http://localhost:3001/other |
  | http://localhost/remote | --> | http://otherserver/remote   |


## Development Setup

* run 2 terminals
* `npm run dev` to start the server in development mode
* `npm run start` to start the angular server
* access the management portal at http://localhost/red-ampp/

![development terminal](https://raw.githubusercontent.com/pcnate/red-ampp/master/assets/dev%20terminal.png)
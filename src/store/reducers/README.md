# Reducers

## Stations

Responsible for keeping the current state of the stations (including start, stop, and instrument info) displayed on the map. Knows what to do with new station data from Transiter.

## Transiter

Knows how to talk to Transiter and keeps track of individual station data (including arrival & departure times). Informs Stations reducer whenever new data comes in so that Stations reducer can fold it into the state of the map.

## Trip

Knows how to talk to Triptik in order to get directions/route info

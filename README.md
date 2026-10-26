# ClearSkies

ClearSkies is a web app that shows a home's radon level in real time. Live at [clearskiesus.org](https://clearskiesus.org).

Radon is an invisible, odorless radioactive gas and the second-leading cause of lung cancer in the US. One-time test kits can miss spikes, because radon levels change with weather, season, and time of day. ClearSkies monitors continuously instead.

## How it works

1. A radon sensor in each home is paired with an ESP32 microcontroller.
2. Every 10 minutes, the ESP32 reads the sensor over Bluetooth Low Energy, converts the reading to pCi/L, and uploads it with a timestamp to a Firebase Realtime Database over Wi-Fi.
3. This website reads from the same database, so new readings appear on the dashboard live, with no refresh.

## Dashboard

- Current radon level with a status label: Low, Caution (2–4 pCi/L), or Above EPA level (4.0+ pCi/L)
- 24-hour trend chart, built from scratch in JavaScript and SVG with no charting library
- Table of the 10 most recent readings, linked to the chart
- Each login is tied to one device, so users only see their own home's readings

## Tech

- Plain HTML, CSS, and JavaScript (no framework or build step)
- Firebase Authentication and Realtime Database
- Hosted on GitHub Pages

## Running locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## License

The code is released under the [MIT License](LICENSE). The ClearSkies name, logo, photos, and site content are not covered by the license.

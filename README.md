# TradeWiser

TradeWiser is a clean, custom open-source trading journal designed to help traders capture trade details, review decision quality, and spot performance trends over time.

## Why it exists

Most trading journals only record wins and losses. TradeWiser helps users answer the deeper questions:

- Why did this trade succeed or fail?
- Did I follow my plan or react emotionally?
- Which strategies are performing over time?
- Where is risk being poorly managed?

## Features

- Trade entry form for symbol, side, setup, notes, and outcomes
- Automated P&L, return %, and R-multiple calculations
- Strategy breakdown and symbol performance tracking
- Equity curve and trend review sections
- Risk calculator and trade review checklist
- Browser-based persistence using local storage
- Clean dashboard UI optimized for quick review

## Open-source approach

This project is designed to be a lightweight, easy-to-run, self-hosted app for individuals or teams who want to review trading behavior and improve process discipline.

## Run locally

1. Clone the repository.
2. Open `index.html` in your browser.
3. Alternatively, serve it with any local static server, for example:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Project structure

- `index.html` — app structure and dashboard sections
- `styles.css` — UI styling and responsive layout
- `app.js` — local storage logic, analytics, trade calculations, and interactions

## Roadmap

- CSV export/import
- Multi-user support with backend persistence
- Advanced strategy analytics
- AI-assisted trade review prompts
- Auth and cloud sync

## License

This project is released under the MIT License.

## Contributing

Contributions are welcome. If you want to improve the analytics, add features, or create a more advanced backend version, feel free to open a pull request.

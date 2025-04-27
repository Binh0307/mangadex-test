# MangaDex Test Automation

This project is a **Playwright-based** end-to-end test suite for MangaDex.

It automates UI testing across different parts of the MangaDex website to ensure stability, usability, and performance.

---

## Features

- Automated tests for MangaDex features (search, navigation, manga details, etc.)
- Built using [Playwright](https://playwright.dev/) for fast and reliable testing



## Installation

1. Clone the repository:

```bash
git clone https://github.com/Binh0307/mangadex-test.git
cd mangadex-test
```

2. Install dependencies:

```bash
npm install
```


## Project Structure

```
.
├── tests/               # Test files
├── pages/               # Page Object Models (POM) for MangaDex pages
├── utils/               # Helper functions and utilities
├── playwright.config.ts # Playwright configuration
├── package.json         # Project metadata and scripts
└── README.md            # Project documentation
```

---

## NPM Scripts

Available scripts:

```bash
npm run test:test    # run test in ui mode
```


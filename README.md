# ⚽ StatKick Pro: Hybrid AI Football Prediction Engine

**StatKick Pro** is a high-performance football match predictor designed for analytical accuracy and data resilience. It leverages a combination of classical statistical modeling (Poisson distribution) and modern Generative AI (Google Gemini) to provide deep insights into 1X2, BTTS, and Over/Under markets.

![Project Status](https://img.shields.io/badge/Status-Production--Ready-emerald?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Gemini%20AI-blue?style=for-the-badge)

---

## 🚀 Key Features

### 1. **Waterfall Data Strategy**
StatKick is engineered for 99.9% uptime. The engine uses a progressive fallback architecture to fetch match data:
- **Tier 1: API-Football (api-sports.io)**: Primary source for global league coverage (J1, Allsvenskan, CSL, etc.).
- **Tier 2: Football-Data.org**: Secondary source for European Big-5 leagues.
- **Tier 3: Gemini AI Search Grounding**: If primary APIs are down or rate-limited, the system deploys Gemini AI to scrape real-time results and schedules directly from the web.

### 2. **Advanced Statistical Modeling**
- **xG (Expected Goals) Modeling**: Calculates projected goals for both teams by comparing relative attack and defense strengths against league-wide averages.
- **Poisson Distribution**: Projects the probability of specific scorelines (0-0 through 5-5) to derive market percentages.
- **Score Matrix Analytics**: A visual heatmap showing the most probable exact results for every match.

### 3. **AI Tactical Intelligence**
Integrating **Gemini 3 Flash**, the app performs a "Tactical Scan" for every match. It researches:
- Recent injury reports and suspensions.
- Team motivation (relegation battles, European qualifying fatigue).
- Real-world tactical shifts not captured by pure historical numbers.

### 4. **Backtest Lab**
Verify the model's accuracy before trusting a prediction. The Backtest Lab pulls historical results for any selected league and runs the engine against past data to calculate:
- **1X2 Accuracy Rate**
- **BTTS Correlation**
- **Over/Under 2.5 Market Efficiency**

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS.
- **Visualization**: Recharts (for probability distributions and pie charts).
- **Intelligence**: Google Gemini API (with Search Grounding enabled).
- **APIs**: API-Football, Football-Data.org.

---

## 📈 Prediction Logic (The Math)

The engine follows the industry-standard Poisson distribution for football modeling:

1.  **Strength Calculation**: 
    - `Home_Attack = (Home_Goals_Scored / Home_Games) / League_Avg_Home_Goals`
    - `Away_Defense = (Away_Goals_Conceded / Away_Games) / League_Avg_Away_Goals`
2.  **Projected xG**:
    - `Home_xG = Home_Attack * Away_Defense * League_Avg_Home_Goals`
3.  **Poisson Matrix**:
    - The probability of a team scoring `k` goals is calculated as: $P(k; \lambda) = \frac{e^{-\lambda} \lambda^k}{k!}$ where $\lambda$ is the projected xG.
4.  **Market Derivation**:
    - **Home Win**: Sum of all matrix cells where $Home\_Goals > Away\_Goals$.
    - **BTTS**: Sum of all cells where both $Home\_Goals > 0$ and $Away\_Goals > 0$.

---

## ⚙️ Configuration

To enable real-time synchronization, navigate to the **Settings** view in the app and provide:
1.  **API-Football Key**: Obtainable from [API-Sports Dashboard](https://dashboard.api-football.com/).
2.  **Football-Data Key**: Obtainable from [Football-Data.org](https://www.football-data.org/client/register).

*Note: If no keys are provided, the system defaults to Gemini AI Search Grounding for all data needs.*

---

## 📁 Project Structure

```text
football-match-predictor/
├── components/          # UI Components (StatCards, HeatMaps, etc.)
├── services/            # API Clients (Gemini, API-Football, Football-Data)
├── utils/               # Core Engine & Math logic (Poisson, xG)
├── types.ts             # Global TypeScript Interfaces
├── constants.ts         # League averages and Mock data
└── App.tsx              # Main Application Controller
```

---

## ⚖️ Disclaimer
This tool is for **informational and analytical purposes only**. Statistical models represent probabilities, not certainties. Betting involves risk; please gamble responsibly.
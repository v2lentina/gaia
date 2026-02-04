# 🌍 Gaia - Interactive World Explorer

Explore countries around the globe with an interactive map, detailed information, and real-time weather data.

## ✨ Features

- **Interactive World Map** - Click on any country to explore
- **Country Details** - Population, languages, currencies, government & more
- **Wikipedia Integration** - Images and additional facts from WikiData
- **Live Weather** - Real-time weather via Module Federation (Remote App)
- **Beautiful UI** - Material UI with responsive design

## 🛠️ Tech Stack

- React 19 + TypeScript
- Vite + Module Federation
- Material UI
- React Simple Maps
- REST Countries API + WikiData API

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**With Weather Widget:**

```bash
# Start Weather Remote (in weather-app folder)
cd ../weather-app && npm run build && npm run preview

# Then start Gaia
npm run dev
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── CountryBasicInfo.tsx
│   ├── CountryWikiData.tsx
│   └── CountryImages.tsx
├── pages/          # Route pages
│   ├── WorldMap.tsx
│   └── CountryDetailsPage.tsx
├── api/            # API services
└── types/          # TypeScript types
```

---

Built with ❤️ and curiosity about our world.

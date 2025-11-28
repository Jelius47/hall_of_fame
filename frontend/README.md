# Neurotech Hall of Fame - Frontend

The frontend for **Neurotech Hall of Fame** - an immersive drawing platform powered by Sarufi (parent of ghala) and Neurotech. Features quest-based authentication and a legendary Hall of Fame gallery.

## 🎨 Features

- **Quest-Based Authentication** - Create first, claim later
- **Drawing Canvas** - Intuitive drawing tools with Konva.js
- **Hall of Fame Gallery** - Showcase of all artworks
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Beautiful Animations** - GSAP and Framer Motion effects
- **Medieval Theme** - Parchment textures and gold accents

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Zustand** - State management
- **Styled Components** - CSS-in-JS styling
- **Konva.js** - Canvas drawing
- **GSAP & Framer Motion** - Animations
- **Axios** - HTTP client
- **Lucide React** - Icons

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on http://localhost:8000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:5173

## 🎮 Usage

### Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

The `.env` file is already configured:

```env
VITE_API_URL=http://localhost:8000/api
```

## 🎯 Quick Start

1. Make sure the backend is running on port 8000
2. Run `npm install`
3. Run `npm run dev`
4. Open http://localhost:5173
5. Click "Begin Your Quest"
6. Start creating your masterpiece and join the Neurotech Hall of Fame!

## 📝 License

MIT

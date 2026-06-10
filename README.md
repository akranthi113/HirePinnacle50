<<<<<<< HEAD
# HirePinnacle50

A React + Vite recruitment platform for hiring candidates efficiently using Supabase backend.

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS + PostCSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Hosting**: GitHub Pages

## Prerequisites

- Node.js 16+ installed
- Git installed
- GitHub account with repository access

## Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory (already configured):
```
VITE_SUPABASE_URL=https://cwdjrandzilgwzycintr.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_9i0nyym4g0iBMOz8ScXGpA_X_1b_t_v
```

### 3. Run Locally
**Option A** - Double-click:
```
start_local.bat
```

**Option B** - Command line:
```bash
npm run dev
```

Server runs at: http://localhost:5173

## Deployment to GitHub Pages

### 1. Build the Project
```bash
npm run build
```

### 2. Push to GitHub
```bash
push_to_main.bat
```

Or manually:
```bash
git add .
git commit -m "Your message"
git push origin main
```

### 3. Enable GitHub Pages
- Go to GitHub repo → Settings → Pages
- Select "Deploy from a branch"
- Choose `main` branch and `/root` folder
- Save

**Your site will be live at**: `https://akranthi113.github.io/HirePinnacle50/`

## Project Structure

```
src/
  ├── components/       # React components
  ├── pages/           # Page components
  ├── context/         # Auth context
  ├── firebase/        # Supabase config & services
  └── utils/           # Helper functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

**Blank page after deployment?**
- Check browser console (F12) for errors
- Verify `.env` Supabase credentials
- Ensure `vite.config.js` has `base: "/HirePinnacle50/"`

**Local dev not working?**
- Run `npm install` first
- Make sure port 5173 is not in use
- Check Node.js version: `node -v`

## Quick Commands

| Action | Command |
|--------|---------|
| Start dev | `npm run dev` |
| Build | `npm run build` |
| Push to GitHub | `push_to_main.bat` |
| Start local | `start_local.bat` |

## Support

For issues, check:
1. Browser console for errors
2. Supabase connection status
3. Environment variables in `.env`
=======
# HirePinnacle50
>>>>>>> c61e551d8d27476299206aeb7c5800db6b5e8093

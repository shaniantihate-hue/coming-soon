# Zaiveriq Labs — Coming Soon

A static single-screen launch page with supplied Clash Grotesk and Satoshi fonts, brand colors, and logo. Serve `dist/` with any HTTP server.

The experience conveys one message: **COMING SOON**. An AI-generated veiled eclipse sits between the two words. Cursor movement selectively reveals the artwork and turns the nearby typography green; clicking or tapping expands the reveal. The page uses 100dvh with a 100vh fallback, responsive portrait and landscape layouts, safe-area padding, motion controls, and reduced-motion support. Contact links use hello@zaiveriq.com. No backend or external asset CDN is required.

The artwork is an AI-generated raster with CSS perspective depth. The supplied logo is retained separately and unmodified.

## Hostinger deployment

The root `package.json` and dependency-free `server.js` let Hostinger run the page as a Node.js website. Use Node.js 22, the `build` script, and the `start` script. The server reads Hostinger's `PORT` environment variable and serves the production files from `dist/`.

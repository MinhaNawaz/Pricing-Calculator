# 🧮 Cart Total — Shop Pricing Calculator

A responsive, single-page pricing calculator that updates live as you shop — pick a product, set the quantity, add extras, and watch the total tally up on a pretty little receipt. No frameworks, no build step, no page reloads.

---

## ✨ Features

- 🛍️ **Product picker** — choose between a Ceramic Mug, Canvas Tote, Wool Scarf, or Leather Wallet
- 🔢 **Quantity control** — stepper buttons *and* a slider, always in sync
- 📉 **Automatic bulk discounts** — 5% off at 5+, 10% off at 20+, 15% off at 50+ units
- 🎁 **Extras** — gift wrapping, express shipping, extended warranty
- 🌍 **Regional tax** — switch between US states, UK VAT, and EU VAT
- 🧾 **Live receipt** — a ticket-style order summary that recalculates instantly on every input
- 📱 **Fully responsive** — collapses to a single column on mobile

---

## 🛠️ Built with

Nothing but the fundamentals:

- **HTML5** — semantic structure
- **CSS3** — custom properties, gradients, `radial-gradient` masking for the ticket's punched-hole seam, responsive grid layout
- **Vanilla JavaScript** — no libraries, no framework, just DOM manipulation and a single `render()` function that recalculates the whole order on every change

Fonts pulled from **Google Fonts**: [`Fraunces`](https://fonts.google.com/specimen/Fraunces) for the headline, [`Inter`](https://fonts.google.com/specimen/Inter) for body text, and [`IBM Plex Mono`](https://fonts.google.com/specimen/IBM+Plex+Mono) for all the numbers.

---

## 📁 Project structure


---

## 🚀 How to use

No installation, no dependencies — it's plain static files.

1. **Clone the repo**
```bash
   git clone https://github.com/your-username/Pricing-Calculator.git
   cd Pricing-Calculator
```
2. **Open it**
   Just double-click `index.html`, or open it with a live server extension in your editor for auto-reload while editing.
3. **That's it.** Pick a product, drag the quantity slider, toggle some extras, and watch the receipt update.

### 🌐 Live demo

If GitHub Pages is enabled on this repo, you can try it here:
`https://your-username.github.io/Pricing-Calculator/`

---

## 🧩 How the math works

---

Made with ☕ and a bit too much love for perforated ticket edges.

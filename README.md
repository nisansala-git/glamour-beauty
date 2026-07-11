# 💄 Glamour Beauty Parlour — Frontend Development Internship
### DevAlpha Technologies | Virtual Internship Program

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

> A complete, production-ready frontend project built across 4 progressive tasks — from a responsive landing page to an advanced admin platform with state management, drag-and-drop, and async API simulation.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Live Demo](#-live-demo)
- [Tasks Completed](#-tasks-completed)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Author](#-author)
- [License](#-license)

---

## 🌟 Project Overview

This project was built as part of the **DevAlpha Technologies Frontend Development Internship**. The theme is a premium beauty parlour called **Glamour Beauty Parlour**, built progressively across 4 tasks — each one adding a new layer of complexity and skill.

All 4 tasks were completed, exceeding the minimum requirement of 2.

---

## 🌐 Live Demo

| Page | Link |
|------|------|
| 🏠 Landing Page | [View Live](https://hilarious-zabaione-a80a25.netlify.app/index.html) |
| 🧩 Components Showcase | [View Live](https://hilarious-zabaione-a80a25.netlify.app/components.html) |
| 💻 Admin Dashboard | [View Live](https://hilarious-zabaione-a80a25.netlify.app/admin.html) |

---

## ✅ Tasks Completed

### 🎨 Task 1 — Responsive Landing Page *(Easy)*

> **Goal:** Build a beautiful, modern, mobile-friendly website foundation.

**What was built:**
- **Design System** — Premium dark theme using CSS variables in `style.css`, featuring hot pink accents (`#D6247C`) and glassmorphism effects on the navigation bar
- **Responsive Layout** — Full responsiveness across Desktop, Tablet, and Mobile using CSS Media Queries
- **Mobile Hamburger Menu** — Smooth slide-in mobile navigation with overlay and body scroll lock
- **Scroll Animations** — Elements fade and slide into view on scroll using `IntersectionObserver`
- **Contact Form Validation** — Client-side validation with inline error messages and a success popup on submission

---

### 🧩 Task 2 — Interactive Web Components *(Easy)*

> **Goal:** Prove core JavaScript and UI skills by building 7 dynamic, standalone components.

**What was built:**

| # | Component | Description |
|---|-----------|-------------|
| 1 | **Testimonials Carousel** | Auto-playing slider with drag/swipe support and dot indicators |
| 2 | **Before & After Slider** | Draggable handle reveals two images — supports mouse, touch & keyboard |
| 3 | **FAQ Accordion** | Smooth expand/collapse with only one panel open at a time |
| 4 | **Animated Counters** | Numbers count up with easeOutQuart easing when scrolled into view |
| 5 | **Toast Notifications** | Stackable, auto-dismissing alerts with 4 types and progress bar |
| 6 | **Multi-Step Booking Wizard** | 3-step form with progress bar, validation, and animated transitions |
| 7 | **Floating Action Button (FAB)** | Speed-dial with WhatsApp, Book Now, and Call actions |

A dedicated **`components.html`** showcase page demonstrates all 7 components in one place.

---

### 💻 Task 3 — Frontend Admin Dashboard SPA *(Intermediate)*

> **Goal:** Build a complete User Interface System for salon staff.

**What was built:**
- **App Shell Layout** — Persistent left sidebar + top navigation header using `admin.html`
- **SPA Routing** — Clicking sidebar links instantly switches views without page reload
- **Interactive Data Table** — Bookings table with real-time text search and status dropdown filter
- **Dark / Light Theme Toggle** — 🌙/☀️ button that switches themes and saves preference to `localStorage`

---

### 🚀 Task 4 — Advanced Frontend Platform *(Advanced)*

> **Goal:** Upgrade the dashboard into a production-level application.

**What was built:**
- **Drag-and-Drop Kanban Board** — Staff can drag appointment cards between "Upcoming", "In Service", and "Completed" columns
- **State Management (AppStore)** — Custom reactive store class connecting all data — adding a booking instantly updates the revenue metric and bar chart
- **Simulated API Loading States** — JavaScript `Promises` simulate real server latency with loading spinners
- **Complete CRUD** — Create, Read, Update, and Delete client records via interactive modals with "Saving..." button states and toast feedback
- **Dark/Light Theme Toggle** — 🌙/☀️ button that instantly switches the entire dashboard between dark and light mode, saving preference to `localStorage`
- **Notification System** — Bell icon with unread indicator, notification panel, and "Mark all read" functionality

---

## 🛠 Tech Stack

| Technology | Usage |
|------------|-------|
| **HTML5** | Semantic markup, accessibility (ARIA), SEO meta tags |
| **CSS3** | CSS Variables, Flexbox, Grid, Media Queries, Animations, Glassmorphism |
| **Vanilla JavaScript** | DOM manipulation, IntersectionObserver, Promises, Drag & Drop API |
| **No frameworks** | Zero dependencies — pure HTML, CSS, JS |

---

## 📁 Project Structure

```
glamour-beauty/
│
├── index.html          # Task 1 — Responsive Landing Page
├── components.html     # Task 2 — Interactive Components Showcase
├── admin.html          # Task 3 & 4 — Admin Dashboard SPA
├── login.html          # Admin login page
│
├── style.css           # Shared design system (CSS variables, components)
├── admin.css           # Admin dashboard specific styles
│
├── script.js           # Landing page + all Task 2 component logic
├── admin.js            # Task 3 & 4 dashboard logic (Store, CRUD, Kanban)
│
└── img/                # Project images
    ├── img1.jpg
    ├── img2.jpg
    └── ...
```

---

## ✨ Features

- ✅ Fully responsive — works on all screen sizes
- ✅ Accessible — ARIA labels, keyboard navigation, focus management
- ✅ Dark/Light theme support
- ✅ Zero external dependencies
- ✅ Clean, well-commented code
- ✅ SPA routing without any framework
- ✅ Reactive state management from scratch
- ✅ Drag and drop with native HTML5 API
- ✅ Simulated async API with Promises

---

## 🚀 Getting Started

No build tools or installation required.

```bash
# 1. Clone the repository
git clone https://github.com/nisansala-git/glamour-beauty-devAlpha.git

# 2. Open the project folder
cd glamour-beauty-devAlpha

# 3. Open index.html in your browser
open index.html
```

Or simply open `index.html` directly in any modern browser (Chrome, Firefox, Safari, Edge).

---



## 👩‍💻 Author

**Nisansala Ariyathilake**
- Portfolio: [my-portfolio-kappa-nine-13.vercel.app](https://my-portfolio-kappa-nine-13.vercel.app)
- GitHub: [@nisansala-git](https://github.com/nisansala-git)

---

## 📄 License

This project was built as part of the **DevAlpha Technologies Virtual Internship Program**.

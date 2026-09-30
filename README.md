# Career Compass

Act as a Principal Full-Stack Engineer and UI/UX Designer. Build an ultra-smooth, high-performance talent marketplace and candidate directory web application called "TalentDeck" using React, Vite, Tailwind CSS, and shadcn/ui. 

Import and use the attached `job_hierarchy_framework.json` as the single source of truth for all job categories, subcategories, and titles across candidate profiles and employer filters.

---

### 1. Visual Performance & Interaction Standards (Strict Requirements)

* **Zero Cumulative Layout Shift (CLS):** Every image container must have a fixed aspect ratio and display an animated shimmering skeleton placeholder while loading.

* **Liquid-Smooth Transitions:** Use Tailwind transitions or Framer Motion for smooth reflows when the grid density changes or when cards enter/exit during filtering.

* **Stop Event Bubbling:** All buttons, dropdowns, and bookmark icons placed inside candidate cards must call `e.stopPropagation()` so interacting with them does not trigger card navigation.

* **Optimistic Interactions:** Bookmarking/saving a candidate must update the UI state instantly with zero lag.

---

### 2. Main Directory Layout & Top Bar

* **Header Bar:**

  * Application logo and branding ("TalentDeck").

  * Global search bar (fuzzy search across candidate name, bio, and location).

  * **Grid Density Switcher:** A dropdown selector allowing employers to toggle the card view between "2 Columns", "4 Columns", and "6 Columns". On mobile screens, automatically fall back to 1 or 2 columns gracefully regardless of desktop toggle state.

  * Direct action button: "+ Candidate Onboarding" linking to the intake form.

* **Employer Filtering Sidebar (Collapsible on Mobile):**

  * Built using the attached `job_hierarchy_framework.json`.

  * Cascading accordions: Industry Domain -> Subcategory -> Specific Job Titles with multi-select checkboxes.

  * Filter badges showing active selections with an instant "Clear All" button.

  * Apply a 250ms debounce to filter events before re-rendering the candidate grid.

  * Match type toggle: "Match Any Selected" vs. "Match All Selected".

---

### 3. Candidate Card Component ("The Quick Pitch")

Each card in the responsive grid must be a clickable card navigating to `/candidate/:id` featuring:

1. **Avatar Image:** High-resolution thumbnail in a fixed aspect ratio container with lazy loading.

2. **Badges:**

   * A "Vetted Candidate" verified badge (shield icon) if `is_vetted` is true.

   * A "Readiness Score" pill (e.g., "94/100 Readiness") styled with color gradients (emerald for 90+, blue for 80+).

3. **Candidate Info:** Full name and physical location.

4. **The Quick Pitch:** Exactly 2 sentences summarizing their operational strengths and career trajectory.

5. **Interactive Job Dropdown:** An internal collapsible accordion or mini-dropdown titled "Qualified Roles (X)". Expanding it reveals the specific titles they perform (pulled from the JSON file). Ensure clicking this dropdown does not navigate to the profile page.

6. **Action Bar:** A bookmark/favorite heart icon and an "Evaluate Profile" link.

---

### 4. Detailed Candidate Profile View (`/candidate/:id`)

Clicking any card smoothly transitions to an executive-level candidate portfolio view:

* **Profile Header:** Expanded avatar, candidate name, verified badge, location, readiness indicator, and direct "Contact Candidate" and "Export Candidate JSON / ATS" action buttons.

* **Quick Pitch Banner:** Prominently featured 2-sentence pitch.

* **Skills & Roles Matrix:** Interactive tags grouped by domain and subcategory matching the JSON framework.

* **Experience & Operational History:** Clean timeline section detailing practical operational roles, leadership metrics, and systems mastered (e.g., Jira, Power BI, Tableau).

* **Education & Credentials:** Dedicated section highlighting professional certifications, licenses, and specialized coursework.

* **Documents & Media Drawer:** Dedicated download cards for verified PDF Resumes, Work Samples, and Credentials with one-click download buttons.

---

### 5. Candidate Onboarding Form (`/onboard`)

A frictionless intake flow for job seekers:

* Input fields for Full Name, Location, and 2-sentence Quick Pitch.

* Profile image file uploader and PDF resume uploader.

* **Standardized Role Selection:** A cascading multi-select interface derived entirely from `job_hierarchy_framework.json`. Candidates select their primary industry domain, open subcategories, and check every specific role they are qualified and comfortable performing.

* Freeform text areas for Operational History, Certifications, and Systems Experience.

---

### 6. Database & Supabase Integration Requirements

Prepare the application to connect with Supabase:

* Define a `candidates` table schema with fields: `id` (UUID), `full_name` (text), `location` (text), `bio` (text), `readiness_score` (int), `is_vetted` (boolean), `available_jobs` (text array: `text[]`), `experience_summary` (text), `certifications` (text[]), `avatar_url` (text), `resume_url` (text), and `created_at` (timestamp).

* Set up mock data fallback with 4 rich candidate records so the app works immediately before the database connection is finalized.

* Include one featured candidate based in Morehead City, NC with an operational leadership and B2B sales background, qualified in roles like "Operations Manager", "General Manager", and "Sales Representative" from the JSON, with 96/100 Readiness, verified status, and specialized project management tools highlighted.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/47bea01a-81ad-57d2-a8a3-8c2e054ae088).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

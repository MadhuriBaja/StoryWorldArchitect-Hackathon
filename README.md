# 🌌 StoryWorld Architect
### AI Worldbuilding & Counterfactual Simulation Laboratory

**Imagine a world. Change its rules. Discover what happens next.**

🚀 **Live Demo:** [Try StoryWorld Architect](https://storyworld-architect-6hm61st8x-neural-foundry.vercel.app/)

💻 **Source Code:** [GitHub Repository](https://github.com/MadhuriBaja/StoryWorldArchitect-Hackathon)

---

## ✨ About the Project

StoryWorld Architect is an AI-powered worldbuilding platform that transforms a creative premise into an interconnected fictional universe.

Instead of generating isolated story elements, the application helps users explore a world through its governing rules, characters, factions, locations, and systemic relationships. Users can also generate visual artwork and simulate how changing a fundamental rule might reshape the world.

The central idea is simple:

**What happens when one rule changes—and an entire world must adapt?**

## 🌍 Features

### 1. AI-Powered World Generation

Start with a creative premise and generate a structured fictional world containing:

- **World Overview:** The setting, atmosphere, background, and central conflict.
- **Characters:** Individuals with motivations, relationships, and connections to the world's rules.
- **Factions:** Groups with agendas, power sources, rivalries, and territories.
- **Locations:** Distinctive places with environmental characteristics and strategic importance.
- **World Rules:** Foundational systems that govern how the fictional universe operates.

### 2. 🎨 AI-Generated World Artwork

Visualize imaginative settings with AI-generated artwork powered by **Cloudflare Workers AI**.

The artwork-generation workflow adds a visual dimension to the worldbuilding experience, helping users imagine the environments and civilizations they create.

### 3. 🧪 What-If Lab: Counterfactual Simulation

Experiment with a generated world by changing one of its foundational rules or proposing an alternative scenario.

Explore potential consequences across:

- Characters and their relationships
- Factions and political power
- Locations and environments
- Resources and social systems
- The overall stability and future of the world

The simulation uses AI to reason about causal relationships and explain how a proposed change could produce immediate and longer-term effects.

### 4. 🎭 Creative Exploration

StoryWorld Architect is designed for:

- Fiction writers and storytellers
- Game designers and worldbuilders
- Tabletop role-playing creators
- Fantasy and science-fiction enthusiasts
- Anyone curious about systems thinking and hypothetical scenarios

## 💡 Example: A World Under the Ocean

Imagine an underwater civilization that depends on ancient luminous crystals for oxygen, energy, and light.

The ruling council controls the crystals, while distant settlements struggle with shortages.

**What if the crystals stopped working for 30 days?**

The What-If Lab can explore possible consequences, including resource shortages, political instability, faction conflicts, unexpected alliances, and environmental changes.

This illustrates the project's goal: using AI not only to generate fictional content, but also to explore how changes in a world can affect its interconnected systems.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack application and API routes |
| React | Interactive user interface |
| TypeScript | Type-safe application development |
| Google Gemini API | Structured world generation and counterfactual reasoning |
| Cloudflare Workers AI | AI-generated world artwork |
| Node.js and npm | Development runtime and package management |
| Git and GitHub | Version control and source-code hosting |
| Vercel | Application deployment |

## 🏗️ How It Works

```text
        User's Creative Premise
                  |
                  v
        Next.js Web Interface
                  |
                  v
          World Generation API
                  |
                  v
          Google Gemini API
                  |
                  v
        Structured Fictional World
        /        |        |       \
       v         v        v        v
   Overview   Characters Factions Locations
                  |
                  v
              World Rules
                  |
          +-------+-------+
          |               |
          v               v
   Artwork Generation   What-If Lab
          |               |
          v               v
 Cloudflare Workers AI  Consequence
                        Simulation
                            |
                            v
                   Cross-Domain Impacts
```

## 🚀 Getting Started

Follow these instructions to run StoryWorld Architect locally.

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/)
- npm
- A Google Gemini API key
- A Cloudflare account with access to Workers AI

### 1. Clone the Repository

```bash
git clone https://github.com/MadhuriBaja/StoryWorldArchitect-Hackathon.git
cd StoryWorldArchitect-Hackathon
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a local environment file from the example.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env.local
```

Open `.env.local` and configure your own credentials:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.1-flash-lite
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
```

Replace the placeholder values with your own credentials.

**Security reminder:**

- Never commit `.env.local` to Git.
- Never publish API keys or access tokens.
- Keep real credentials in local environment settings or your deployment provider's environment-variable settings.
- Keep `.env.example` limited to variable names and safe placeholder values.

### 4. Start the Development Server

```bash
npm run dev
```

Open the application at:

[http://localhost:3000](http://localhost:3000)

### 5. Run TypeScript Validation

```bash
npx tsc --noEmit
```

### 6. Create a Production Build

```bash
npm run build
```

A successful production build helps verify that the application is ready for deployment.

## 📁 Project Structure

The following is a high-level overview of the repository:

```text
StoryWorldArchitect-Hackathon/
├── devpost/
│   ├── scope.md
│   ├── prd.md
│   ├── spec.md
│   └── checklist.md
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── generate-world/
│   │       ├── generate-world-artwork/
│   │       └── simulate-consequences/
│   ├── components/
│   │   └── WhatIfLab.tsx
│   └── lib/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

Individual files and folders may evolve as the project develops.

## 🧠 Development Approach

StoryWorld Architect was developed using a planning-first workflow supported by project documentation.

The repository includes:

- **`scope.md`** — Defines the project's scope and boundaries.
- **`prd.md`** — Documents product requirements and expected functionality.
- **`spec.md`** — Describes the technical implementation.

An iterative coding-agent workflow helped turn the plan into a working application through implementation, testing, debugging, and refinement.

## 📚 What I Learned

Building this project provided practical experience with:

- Planning a software project before implementation.
- Working iteratively with a coding agent.
- Integrating text-generation and image-generation AI services.
- Building API routes and handling structured AI responses.
- Managing environment variables and external service dependencies.
- Debugging application issues and validating production builds.
- Deploying a full-stack TypeScript application.

Most importantly, this project helped me explore how AI can support both creative generation and the analysis of hypothetical consequences.

## 🔮 Future Improvements

Potential future enhancements include:

- Saving and revisiting generated worlds.
- Editing relationships between characters, factions, and locations.
- Branching timelines and simulation histories.
- Interactive maps of world entities and their connections.
- More controls for customizing world generation and simulations.

These are possible future extensions, not claims about existing functionality.

## 🏆 Hackathon

Built for **Build With AI: Basics**, a Devpost learning hackathon focused on planning and implementing projects with AI-assisted development.

The project brings together structured planning, full-stack engineering, generative AI, and counterfactual experimentation in one creative application.

## 📄 License

See the repository's `LICENSE` file for the applicable open-source license.

## 👩‍💻 Author

**Madhuri Baja**

- GitHub: [MadhuriBaja](https://github.com/MadhuriBaja)
- Project Repository: [StoryWorld Architect](https://github.com/MadhuriBaja/StoryWorldArchitect-Hackathon)
- Live Application: [Open StoryWorld Architect](https://storyworld-architect-6hm61st8x-neural-foundry.vercel.app/)

---

**StoryWorld Architect — Where imagination meets systems thinking.**

# 🎨 VirtueTech AI: Technical Skill, Virtue & STEM Project Coloring Book Generator

> **An AI prompt engineering framework, web application, and autonomous agent loop runner that generates 12-page children's coloring books (ages 4-9) teaching technical skills, instilling Christian virtues, enforcing copyright archetype protection, embedding seek-and-find mazes, and building towards a cumulative 12-issue annual master project.**

---

## 🤖 Autonomous Agent Loop Runner (`agentLoop.js`)

Run continuous, autonomous generation loops that observe topic queues, run copyright sanitization, sequence 12-issue annual series, and export printable HTML/PDF packages automatically.

### Running via CLI
```bash
# Run the autonomous agent loop from terminal
npm run agent
```

### Running via Web UI Controller
Navigate to the **🤖 Agent Loop** tab in the web interface to configure topic task queues, start/step/pause execution, and view real-time console log feeds.

---

## 🌟 Key Features & Core Rules

### 1. 🧩 Page 11: Interactive Line-Art Vector Mazes & Puzzles
Every issue includes an interactive line-art maze or logic pathfinder (e.g. *Circuit Pathfinder Maze*, *Gear Alignment Pathfinder*, *Code Block Logic*) with bold black outlines suitable for ages 4-9.

### 2. 🔨 Page 12: Household STEM Projects & 12-Issue Master Arc
Page 12 of every issue features a safe hands-on STEM project using everyday household materials (paper, craft sticks, foil, tape, plastic bottles) and awards **1 mystery blueprint component**. Across 12 monthly issues, these components accumulate into a grand master project (*The Solar Smart Eco-Citadel*), hinting at how all parts assemble without spoiling the final build early!

### 3. 🛡️ Copyright Archetype Sanitization
Intercepts protected intellectual properties and translates them into copyright-safe generic archetypes:
* **"Paw Patrol"** &rarr; `Mighty Rescue Pigs` / `Heroic Patrol Pups`
* **"My Little Pony"** &rarr; `Magical Forest Elves` / `Enchanted Meadow Ponies`
* **"Transformers"** &rarr; `Shape-Shifting Helper Bots`
* **"Legos"** &rarr; `Interlocking Toy Bricks`
* **"Iron Man / Superhero"** &rarr; `Armored Tech Knight` / `Guardian Champion`
* **"Pokemon"** &rarr; `Pocket Elemental Companions`

### 4. ✝️ Christian Virtue Integration Matrix
Assigns one of the 10 core Christian Virtues (*Love, Joy, Peace, Patience, Kindness, Goodness, Faithfulness, Gentleness, Self-Control, Forgiveness*) to every page scene description.

### 5. 🔍 Seek-and-Find Directive Engine
Embeds hidden shape instructions into every line art prompt:
> *"Embed 3 distinct 'Cross-my-heart' shapes hidden within background elements like clouds, leaves, gears, or circuits."*

---

## 🏆 12-Issue Cumulative Master Arc: The Solar Smart Eco-Citadel

| Issue # | Collected Blueprint Component | Hands-On Household STEM Build | Story & Virtue Focus |
| :---: | :--- | :--- | :--- |
| **#1** | Base Foundation & Power Grid Traces | Cardboard Baseplate & Foil Traces | Planning & Patience |
| **#2** | Solar Canopy Array | Papercraft Solar Panel Reflector | Clean Energy & Joy |
| **#3** | Rainwater Harvest & Filtration Tower | Sand & Charcoal Bottle Water Filter | Purification & Goodness |
| **#4** | Micro-Brain Command Center | Cardboard Console with Switch | Logic & Self-Control |
| **#5** | Wind Turbine Energy Mast | Pinwheel Paper Turbine | Wind Energy & Peace |
| **#6** | Robotic Helper Docking Bay | Craft Stick Elevator & Ramp | Robotics & Gentleness |
| **#7** | Hydroponic Greenhouse Roof | Sprout Tray & Foil Cover | Gardening & Kindness |
| **#8** | Audio Broadcast Beacon | Cup & String Amplifier | Communication & Joy |
| **#9** | Safety Barrier & Emergency Gate | Popsicle Stick Hydraulic Gate | Protection & Self-Control |
| **#10** | Automated Waste Sorting Chute | Gravity Marble & Magnet Sorter | Stewardship & Faithfulness |
| **#11** | Communication Satellite Dish | Foil Parabolic Sound Dish | Outreach & Love |
| **#12** | **Grand Master Citadel Assembly** | **Connecting All 11 Modules Together!** | **Grand Completion & Celebration** |

---

## 🚀 Quick Start & Installation

```bash
# Clone the repository
git clone https://github.com/your-username/virtue-tech-coloring-books.git

# Navigate into the project folder
cd virtue-tech-coloring-books

# Install dependencies
npm install

# Start local development server
npm run dev

# Run autonomous agent loop
npm run agent

# Build for production distribution
npm run build
```

---

## 🛠️ Project Architecture

```
virtue-tech-coloring-books/
├── index.html                  # Main application UI & Agent Controller
├── package.json                # Dependencies and npm scripts
├── README.md                   # Project documentation
├── LICENSE                     # MIT Open Source License
├── .gitignore                  # Git ignore rules
├── output/books/               # Agent loop exported JSON & HTML packages
└── src/
    ├── style.css               # Design system & console styling
    ├── app.js                  # Issue selector, master arc & agent UI
    ├── agent/
        ├── agentCore.js        # Browser & Node agent execution loop
        └── agentLoop.js        # CLI runner & file exporter
    └── engine/
        ├── systemPrompts.js    # Layered system instructions & 12-issue master arc
        ├── coloringBookGenerator.js # 12-page sequence generator
        └── lineArtRenderer.js  # Vector SVG line art, mazes & blueprint renderer
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

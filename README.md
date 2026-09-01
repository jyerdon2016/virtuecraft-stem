# 🎨 VirtueTech AI: Technical Skill & Virtue Coloring Book Generator

> **An AI prompt engineering framework and web application that generates 10-12 page children's coloring books teaching technical skills, instilling Christian virtues, enforcing copyright archetype protection, and embedding interactive seek-and-find directives.**

---

## 🌟 Key Features & Core Rules

### 1. 🛡️ Copyright Archetype Sanitization
Instructs the backend LLM to automatically intercept protected intellectual properties and translate them into copyright-safe generic archetypes:
* **"Paw Patrol"** &rarr; `Mighty Rescue Pigs` / `Heroic Patrol Pups`
* **"My Little Pony"** &rarr; `Magical Forest Elves` / `Enchanted Meadow Ponies`
* **"Transformers"** &rarr; `Shape-Shifting Helper Bots`
* **"Legos"** &rarr; `Interlocking Toy Bricks`
* **"Iron Man / Superhero"** &rarr; `Armored Tech Knight` / `Guardian Champion`
* **"Pokemon"** &rarr; `Pocket Elemental Companions`

### 2. ✝️ Christian Virtue Integration Matrix
Assigns one of the 10 core Christian Virtues (*Love, Joy, Peace, Patience, Kindness, Goodness, Faithfulness, Gentleness, Self-Control, Forgiveness*) to every page, weaving the value directly into the mechanical action (e.g. demonstrating *Patience* while measuring, showing *Kindness* when sharing tools).

### 3. 🔍 Seek-and-Find Directive Engine
Appends strict hidden shape directives into every black-and-white line art prompt:
> *"Embed 3 distinct 'Cross-my-heart' shapes hidden within the background elements like clouds, leaves, gears, or circuits."*

### 4. 🤖 10–12 Step Technical Skill Breakdown
Parses any "how-to" request (e.g., *How to Build a Robot*, *How Solar Power Works*, *How 3D Printers Work*) and sequences it into 10–12 visual steps for children, prioritizing safety, curiosity, and hands-on learning.

---

## 📸 Example Image Prompt Matrix

| Theme Goal | Backend Image Generation Prompt String Example |
| :--- | :--- |
| **Copyright-Safe Parody** | `Bold outlines, simple black and white line art, a team of heroic 'Mighty Pigs' wearing superhero capes riding in a fire engine, clean lines, plain white background, children's coloring book style.` |
| **Bible Stories / Virtues** | `Bold outlines, simple black and white line art, a 'Little Elf' sharing her lunch with a squirrel, demonstrating kindness and love, 3 hidden hearts disguised as leaves in the trees, no shading, plain white background.` |
| **Seek-and-Find Activity** | `Bold outlines, simple black and white line art, two friends hugging and showing forgiveness after dropping a toy, 5 hidden hearts integrated into the clouds and grass, high contrast, low detail, children's coloring book style.` |

---

## 📖 Sequential Narrative Example: "How to Build a Robot"

* **Page 1 (Planning):** A child drawing a blueprint at a workbench, demonstrating *Patience*. (Prompt includes 3 hidden Cross-my-heart shapes in the blueprint clouds).
* **Page 2 (The Brain):** An oversized, simplified ESP32 microcontroller with a happy face, explaining that robots need a brain to think.
* **Page 3 (The Senses):** Wiring up a simple DHT11 temperature sensor or a motion sensor, teaching the virtue of *Gentleness* and curiosity about how things work.
* **Page 4 (The Voice):** Connecting a small audio amplifier (like a PAM8403) and a speaker, showing the robot learning to speak kind words, demonstrating *Joy*.
* **Page 5 (Teamwork & Safety):** The child and a parent or friend soldering wires together safely with goggles, demonstrating *Love* and *Sharing* knowledge.
* **Pages 6–12:** Motors, Battery Energy, Code Blocks, Debugging with *Peace*, Serving Others with *Kindness*, Rebuilding with *Forgiveness*, and Celebration.

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

# Build for production distribution
npm run build
```

---

## 🛠️ Project Architecture

```
virtue-tech-coloring-books/
├── index.html                  # Main application UI layout
├── package.json                # Dependencies and npm scripts
├── README.md                   # Project documentation
├── LICENSE                     # MIT Open Source License
├── .gitignore                  # Git ignore rules
└── src/
    ├── style.css               # Modern design system & print styles
    ├── app.js                  # Frontend controller & tab manager
    └── engine/
        ├── systemPrompts.js    # Layered system instructions & IP mappings
        ├── coloringBookGenerator.js # 10-12 page sequence generator
        └── lineArtRenderer.js  # Vector SVG line art & hidden object game engine
```

---

## 🖨️ PDF & Print Export

The application includes print styling (`@media print`). Clicking **🖨️ Print Book / PDF** automatically formats all 10-12 pages into full-page printable black & white coloring sheets suitable for physical binding or classroom distribution.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

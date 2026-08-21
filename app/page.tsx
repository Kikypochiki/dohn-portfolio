import Image from "next/image";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { SiteHeader } from "@/components/site-header";
import { AsciiNameplate } from "@/components/ascii-nameplate";
import { AsciiSakura } from "@/components/ascii-sakura";

type Project = {
  name: string;
  description: string;
  repository: string;
  status: string;
  category: string;
  technologies: string[];
};

const projects: Project[] = [
  {
    name: "Hello Tagbilaran",
    description: "An independent editorial city guide combining a living archive, a 3D city atlas, place discovery, reviewed Street View, and scenario-based hazard maps.",
    repository: "https://github.com/Kikypochiki/hello-tagbilaran",
    status: "Active",
    category: "City guide and mapping",
    technologies: ["Next.js 16", "TypeScript", "MapLibre", "GSAP", "Playwright"],
  },
  {
    name: "Dormitory Evaluation System",
    description: "A retention-focused system shaped around the real review process and responsibilities of Mabolo Men's Home.",
    repository: "https://github.com/Kikypochiki/Dormitory-Evaluation-System",
    status: "Repository setup",
    category: "Community operations",
    technologies: ["Evaluation workflows", "Dormitory operations"],
  },
  {
    name: "Co5mo",
    description: "A rapid emergency-response system commissioned by VSU Nursing students, designed around coordinated alerts and timely action.",
    repository: "https://github.com/Kikypochiki/co5mo",
    status: "Paused prototype",
    category: "Emergency response",
    technologies: ["Next.js", "Supabase", "React Query", "Web Push"],
  },
  {
    name: "UbayHarvest",
    description: "An agricultural showcase marketplace helping farmers in Ubay, Bohol present produce and connect their harvest with buyers.",
    repository: "https://github.com/Kikypochiki/max-food",
    status: "Prototype",
    category: "Agricultural marketplace",
    technologies: ["Flutter", "Dart", "Mobile UI"],
  },
  {
    name: "Mabolo Plants",
    description: "A QR tagging platform for Jardin de Mabolo. Each scan opens clear crop and vegetable information for garden visitors.",
    repository: "https://github.com/Kikypochiki/mabolo-plants",
    status: "Active",
    category: "QR information platform",
    technologies: ["React 19", "TypeScript", "Vite", "React Router"],
  },
  {
    name: "Storya Viscans",
    description: "A community platform where Viscans could share stories, join campus discussions, and access academic resources in one familiar space.",
    repository: "https://github.com/Kikypochiki/Storya-Viscans",
    status: "Discontinued",
    category: "Campus community",
    technologies: ["Next.js", "Supabase", "Radix UI", "TypeScript"],
  },
  {
    name: "E-Maternity Portal",
    description: "A commissioned healthcare portal for patient records, appointments, and secure access to maternity information.",
    repository: "https://github.com/Kikypochiki/E-maternity-portal",
    status: "Paused prototype",
    category: "Healthcare management",
    technologies: ["Next.js", "Supabase", "Radix UI", "React Hook Form"],
  },
];

const skillGroups = [
  ["Programming languages", "C / C++ / C# / Java / Python / JavaScript / TypeScript"],
  ["Frameworks", "Flask / Flutter / Next.js"],
  ["Databases", "MySQL / PostgreSQL / Firebase / Supabase"],
  ["Design", "UI/UX design / Visual systems / Responsive design / Prototyping / Graphic design"],
  ["Tools", "Git / VS Code / Photoshop / Figma"],
  ["Exploring", "Agentic AI / MapLibre / GSAP / Testing / Accessibility"],
] as const;

function ProjectEntry({ project }: { project: Project }) {
  return (
    <article className="project-entry">
      <header className="project-entry-header">
        <h3>{project.name}</h3>
        <p><span>{project.category}</span><span>{project.status}</span></p>
      </header>
      <div className="project-entry-body">
        <p>{project.description}</p>
        <p className="technology-line">{project.technologies.join(" / ")}</p>
        <a className="terminal-link" href={project.repository} target="_blank" rel="noreferrer">
          <span aria-hidden="true">▸</span> open repository <ArrowUpRight size={14} weight="regular" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main id="home">
      <SiteHeader />

      <div className="terminal-shell">
        <section className="hero" aria-labelledby="hero-title">
          <p className="prompt"><strong>dohn@varquez</strong>./portfolio</p>
          <div className="hero-identity">
            <AsciiNameplate />
            <AsciiSakura />
          </div>
          <div id="about" className="hero-profile" aria-labelledby="about-title">
            <h2 id="about-title" className="sr-only">About Dohn Michael Varquez</h2>
            <div className="profile-image">
              <Image
                src="/images/dohn-portrait.png"
                alt="Dohn Michael Varquez overlooking the city at night"
                fill
                priority
                sizes="(max-width: 720px) calc(100vw - 32px), 210px"
                className="portrait-image"
              />
            </div>
            <div className="hero-profile-copy">
              <p className="hero-lead">I&apos;m a fourth-year Computer Science student at Visayas State University, working toward full-stack development and UI/UX design.</p>
              <p className="hero-bio">I&apos;m interested in full-stack systems, agentic AI, and practical software that helps people.</p>
            </div>
          </div>
        </section>

        <section id="projects" className="projects terminal-section" aria-labelledby="projects-title">
          <h2 id="projects-title">Projects</h2>
          <div className="project-list">
            {projects.map((project) => <ProjectEntry key={project.name} project={project} />)}
          </div>
        </section>

        <section id="skills" className="skills terminal-section" aria-labelledby="skills-title">
          <h2 id="skills-title">Skills + technology</h2>
          <div className="skill-list">
            {skillGroups.map(([title, items]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{items}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="education" className="education terminal-section" aria-labelledby="education-title">
          <h2 id="education-title">Education</h2>
          <div className="education-record">
            <div>
              <h3>Bachelor of Science in Computer Science</h3>
              <p>Visayas State University</p>
            </div>
            <p>Fourth-year student</p>
          </div>
          <p>My project work connects software engineering with interface design and community-focused technology.</p>
        </section>

        <section id="contact" className="contact terminal-section" aria-labelledby="contact-title">
          <h2 id="contact-title">Let&apos;s work together.</h2>
          <p>I am open to entry-level software roles, internships, freelance projects, and collaborations where design and engineering meet.</p>
          <div className="contact-links">
            <a className="terminal-link" href="mailto:dohnmechael@gmail.com"><span aria-hidden="true">▸</span> dohnmechael@gmail.com</a>
            <a className="terminal-link" href="https://github.com/Kikypochiki" target="_blank" rel="noreferrer">
              <GithubLogo size={15} weight="regular" aria-hidden="true" /> github.com/Kikypochiki
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

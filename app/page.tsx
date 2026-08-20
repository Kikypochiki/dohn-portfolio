import Image, { type StaticImageData } from "next/image";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { SiteHeader } from "@/components/site-header";

type Project = {
  name: string;
  description: string;
  repository: string;
  status: string;
  technologies: string[];
  image: string | StaticImageData;
  featured?: boolean;
  localImage?: boolean;
};

const projects: Project[] = [
  {
    name: "Hello Tagbilaran",
    description: "An independent editorial city guide combining a living archive, a 3D city atlas, place discovery, reviewed Street View, and scenario-based hazard maps.",
    repository: "https://github.com/Kikypochiki/hello-tagbilaran",
    status: "Active",
    technologies: ["Next.js 16", "TypeScript", "MapLibre", "GSAP", "Playwright"],
    image: "/images/hello-tagbilaran.jpg",
    featured: true,
    localImage: true,
  },
  {
    name: "Co5mo",
    description: "A rapid emergency-response system commissioned by Visayas State University Nursing students, designed around coordinated alerts and timely action.",
    repository: "https://github.com/Kikypochiki/co5mo",
    status: "Paused prototype",
    technologies: ["Next.js", "Supabase", "React Query", "Web Push"],
    image: "https://opengraph.githubassets.com/portfolio/Kikypochiki/co5mo",
  },
  {
    name: "UbayHarvest",
    description: "An agricultural showcase marketplace created to help farmers in Ubay, Bohol present produce and connect their harvest with potential buyers.",
    repository: "https://github.com/Kikypochiki/max-food",
    status: "Prototype",
    technologies: ["Flutter", "Dart", "Mobile UI"],
    image: "https://opengraph.githubassets.com/portfolio/Kikypochiki/max-food",
  },
  {
    name: "Mabolo Plants",
    description: "A QR tagging platform for Jardin de Mabolo. Each scan opens clear crop and vegetable information for dormitory garden visitors.",
    repository: "https://github.com/Kikypochiki/mabolo-plants",
    status: "Active",
    technologies: ["React 19", "TypeScript", "Vite", "React Router"],
    image: "https://opengraph.githubassets.com/portfolio/Kikypochiki/mabolo-plants",
  },
  {
    name: "Storya Viscans",
    description: "A community platform where Viscans could share stories, join campus discussions, and access academic resources in one familiar space.",
    repository: "https://github.com/Kikypochiki/Storya-Viscans",
    status: "Discontinued",
    technologies: ["Next.js", "Supabase", "Radix UI", "TypeScript"],
    image: "/images/storya-viscans.jpg",
    localImage: true,
  },
  {
    name: "E-Maternity Portal",
    description: "A healthcare management portal commissioned by Nursing students for patient records, appointments, and secure access to maternity information.",
    repository: "https://github.com/Kikypochiki/E-maternity-portal",
    status: "Paused prototype",
    technologies: ["Next.js", "Supabase", "Radix UI", "React Hook Form"],
    image: "https://opengraph.githubassets.com/portfolio/Kikypochiki/E-maternity-portal",
  },
  {
    name: "Dormitory Evaluation System",
    description: "A retention-focused evaluation system for Mabolo Men's Home, shaped around the dormitory's real review process and community responsibilities.",
    repository: "https://github.com/Kikypochiki/Dormitory-Evaluation-System",
    status: "Repository setup",
    technologies: ["Evaluation workflows", "Dormitory operations"],
    image: "https://opengraph.githubassets.com/portfolio/Kikypochiki/Dormitory-Evaluation-System",
  },
];

const skillGroups = [
  {
    title: "Build",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Vite"],
  },
  {
    title: "Design",
    items: ["UI/UX design", "Visual systems", "Responsive design", "Prototyping", "Graphic design"],
  },
  {
    title: "Explore",
    items: ["MapLibre", "Flutter", "GSAP", "Testing", "Accessibility", "Service startups"],
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className={`project-card ${project.featured ? "project-featured" : ""}`}>
      <a className="project-image-link" href={project.repository} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} repository`}>
        <div className="project-image">
          <Image
            src={project.image}
            alt={`${project.name} project preview`}
            fill
            sizes={project.featured ? "(max-width: 900px) 100vw, 65vw" : "(max-width: 900px) 100vw, 45vw"}
            className="project-image-element"
            unoptimized={!project.localImage}
          />
        </div>
      </a>
      <div className="project-content">
        <div className="project-meta">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{project.status}</span>
        </div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <div className="technology-list" aria-label={`${project.name} technologies`}>
          {project.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
        <a className="text-link" href={project.repository} target="_blank" rel="noreferrer">
          Open repository <ArrowUpRight size={17} weight="regular" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main id="home">
      <SiteHeader />

      <section className="hero section-shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Full-stack developer + UI/UX designer</p>
          <h1 id="hero-title">I design interfaces. <span>I build systems.</span></h1>
          <p className="hero-intro">Fourth-year Computer Science student turning service problems into useful, considered software for communities and growing teams.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#projects">View projects</a>
            <a className="secondary-button" href="https://github.com/Kikypochiki" target="_blank" rel="noreferrer">
              <GithubLogo size={18} weight="regular" aria-hidden="true" /> GitHub profile
            </a>
          </div>
        </div>

        <div className="portrait-frame">
          <Image
            src="/images/dohn-portrait.png"
            alt="Portrait of Dohn Michael Varquez overlooking the city at night"
            fill
            priority
            sizes="(max-width: 800px) 100vw, 45vw"
            className="portrait-image"
          />
          <div className="portrait-caption">
            <span>Dohn Michael Varquez</span>
            <span>Software engineer in progress</span>
          </div>
        </div>
      </section>

      <section id="about" className="about section-shell section-space" aria-labelledby="about-title">
        <div className="section-marker">About</div>
        <div className="about-grid">
          <h2 id="about-title">Design trained my eye. Computer science taught me how to make the idea work.</h2>
          <div className="about-copy">
            <p>I am Dohn Michael Varquez, a fourth-year Computer Science student at Visayas State University with a background in graphic design and a growing full-stack practice.</p>
            <p>I am most interested in useful systems: tools grounded in real communities, clear interfaces, and service-driven ideas that can become sustainable products.</p>
            <blockquote>“I work hard, follow through, and get things done.”</blockquote>
          </div>
        </div>
      </section>

      <section id="projects" className="projects section-shell section-space" aria-labelledby="projects-title">
        <header className="section-heading">
          <p className="eyebrow">Selected work</p>
          <h2 id="projects-title">Software shaped by real people and places.</h2>
          <p>Community platforms, student commissions, local discovery, agriculture, healthcare, and dormitory operations.</p>
        </header>
        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
        </div>
      </section>

      <section id="skills" className="skills section-shell section-space" aria-labelledby="skills-title">
        <div className="section-marker">Skills + technology</div>
        <h2 id="skills-title">A design-aware engineering toolkit.</h2>
        <div className="skill-grid">
          {skillGroups.map((group) => (
            <article key={group.title} className="skill-group">
              <h3>{group.title}</h3>
              <div className="skill-items">
                {group.items.map((item) => <span key={item}>{item}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="education" className="education section-shell section-space" aria-labelledby="education-title">
        <div className="education-copy">
          <p className="eyebrow">Education</p>
          <h2 id="education-title">Visayas State University</h2>
          <p>Bachelor of Science in Computer Science</p>
        </div>
        <div className="education-detail">
          <strong>Fourth-year student</strong>
          <p>Building at the intersection of software engineering, interface design, and community-focused technology.</p>
        </div>
      </section>

      <section id="contact" className="contact section-shell section-space" aria-labelledby="contact-title">
        <p className="eyebrow">Contact</p>
        <h2 id="contact-title">Have a role, project, or problem worth building?</h2>
        <a className="contact-email" href="mailto:dohnmechael@gmail.com">dohnmechael@gmail.com</a>
        <div className="contact-links">
          <a href="https://github.com/Kikypochiki" target="_blank" rel="noreferrer">GitHub</a>
          <a href="#home">Back to top</a>
        </div>
      </section>

      <footer className="site-footer section-shell">
        <span>Dohn Michael Varquez</span>
        <span>Designed and built with care.</span>
      </footer>
    </main>
  );
}

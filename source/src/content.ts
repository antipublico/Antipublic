export type LinkItem = { label: string; href: string };
export type ProjectItem = { title: string; href?: string; description?: string };
export type ExperienceItem = { org: string; location: string; role?: string };
export type EducationItem = { school: string; detail: string };
export type EventItem = { date: string; title: string; href?: string; location?: string };

export const header = {
  name: "",
  tagline: "",
};

export const links: LinkItem[] = [];

export const contact = {
  blurb: "",
  email: "",
};

export const shortlist: ProjectItem[] = [];

export const moreProjects: ProjectItem[] = [];

export const inPersonEvents: EventItem[] = [];

export const thingsILike = [];

export const workExperience: ExperienceItem[] = [];

export const education: EducationItem[] = [];


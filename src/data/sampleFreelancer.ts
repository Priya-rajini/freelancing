import type { TalentProfile } from "../utils/matching";

export const SAMPLE_FREELANCER_ID = "talent-sample-alex-rivera";

/** Demo freelancer for testing matches and project proposals */
export const SAMPLE_FREELANCER: TalentProfile = {
  id: SAMPLE_FREELANCER_ID,
  name: "Alex Rivera",
  headline: "Full-stack Developer Specialist",
  location: "Austin, TX",
  avatar: "AR",
  color: "#6ee7b7",
  skills: [
    "React",
    "TypeScript",
    "Node",
    "Tailwind CSS",
    "JavaScript",
    "PostgreSQL",
    "Figma",
    "UI Design",
  ],
  verified: ["React", "TypeScript"],
  bio: "Sample test freelancer for SkillSync demos. Full-stack engineer with 5 years building SaaS dashboards, APIs, and design systems.",
  experienceYears: 5,
  availability: "20 hrs/week",
  isVerified: true,
  updatedAt: Date.now(),
};

export const SAMPLE_PROPOSAL_MESSAGE =
  "I've delivered similar web apps and match your stack. I can start this week with clear milestones and weekly updates.";

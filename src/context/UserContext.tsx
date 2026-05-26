import React, { createContext, useContext, useState, useEffect } from "react";
import {
  defaultContracts,
  defaultEarnings,
  defaultWithdrawals,
  defaultClientReviews,
} from "../data/workspaceData";

export type DeliverableStatus = "pending" | "in_progress" | "submitted" | "approved";

export interface Deliverable {
  id: string;
  title: string;
  status: DeliverableStatus;
  dueDate: string;
}

export interface ContractFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

export interface ContractMessage {
  id: string;
  from: "client" | "freelancer";
  text: string;
  time: string;
}

export interface ActiveContract {
  id: string;
  projectId: string;
  title: string;
  client: string;
  clientContact: string;
  budget: string;
  progress: number;
  due: string;
  deliverables: Deliverable[];
  files: ContractFile[];
  messages: ContractMessage[];
}

export interface Withdrawal {
  id: string;
  amount: number;
  date: string;
  status: "completed" | "processing" | "failed";
  method: string;
}

export interface ClientReview {
  id: string;
  client: string;
  project: string;
  rating: number;
  text: string;
  date: string;
}

export interface EarningsSummary {
  totalEarned: number;
  pending: number;
  available: number;
}

export type UserRole = "freelancer" | "client" | "both" | null;
export type RoleView = "freelancer" | "client";
export type AvailabilityStatus = "available" | "unavailable" | "open";
export type VerificationStatus = "unverified" | "verifying" | "verified";
export type VerificationMethod = "student_id" | "linkedin" | null;

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startYear: string;
  endYear: string;
  desc: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  category: string;
  techUsed: string[];
  image: string;
  link: string;
  size?: string;
  metrics: {
    views: string;
    conversion: string;
  };
}

export interface Proposal {
  id: string;
  projectId: string;
  projectTitle: string;
  clientName: string;
  bidAmount: string;
  timeline: string;
  coverMessage: string;
  status: "pending" | "accepted" | "declined";
  score: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  color: string;
  role: UserRole;
  activeRoleView: RoleView;
  bio: string;
  location: string;
  skills: string[];
  verified: string[];
  portfolioItems: PortfolioItem[];
  verification: {
    status: VerificationStatus;
    method: VerificationMethod;
    value: string | null;
  };
  isRegistered: boolean;
  
  // New profile fields
  hourlyRate: string;
  availability: AvailabilityStatus;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  
  // Proposals list
  proposals: Proposal[];

  // Freelancer workspace
  contracts: ActiveContract[];
  earnings: EarningsSummary;
  withdrawals: Withdrawal[];
  clientReviews: ClientReview[];
}

interface UserContextType {
  user: UserProfile;
  signup: (name: string, location: string, color: string) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  setActiveRoleView: (view: RoleView) => void;
  updateBio: (bio: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  updateProfileDetails: (rate: string, availability: AvailabilityStatus) => void;
  addEducationEntry: (school: string, degree: string, field: string, startYear: string, endYear: string) => void;
  removeEducationEntry: (id: string) => void;
  addExperienceEntry: (company: string, role: string, startYear: string, endYear: string, desc: string) => void;
  removeExperienceEntry: (id: string) => void;
  addDetailedPortfolioItem: (title: string, description: string, category: string, techUsed: string[], image: string, link: string) => void;
  addPortfolioItem: (title: string, category: string, image: string) => void;
  removePortfolioItem: (id: number) => void;
  submitProposal: (projectId: string, projectTitle: string, clientName: string, bidAmount: string, timeline: string, coverMessage: string) => void;
  addVerifiedBadge: (badge: string) => void;
  startVerification: (method: VerificationMethod, value: string) => Promise<void>;
  resetVerification: () => void;
  updateDeliverableStatus: (contractId: string, deliverableId: string, status: DeliverableStatus) => void;
  uploadContractFile: (contractId: string, fileName: string, fileSize: string) => void;
  sendContractMessage: (contractId: string, text: string) => void;
  requestWithdrawal: (amount: number, method: string) => void;
  completeness: {
    score: number;
    checklist: {
      roleSelected: boolean;
      verified: boolean;
      bioAdded: boolean;
      skillsAdded: boolean;
      detailsAdded: boolean; // Rate & Availability
      educationAdded: boolean;
      experienceAdded: boolean;
      portfolioAdded: boolean;
    };
  };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("skillsync_user_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          hourlyRate: parsed.hourlyRate ?? "$95/hr",
          availability: parsed.availability ?? "available",
          education: parsed.education ?? [],
          experience: parsed.experience ?? [],
          proposals: parsed.proposals ?? [],
          contracts: parsed.contracts?.length ? parsed.contracts : (defaultContracts as ActiveContract[]),
          earnings: parsed.earnings ?? defaultEarnings,
          withdrawals: parsed.withdrawals?.length ? parsed.withdrawals : (defaultWithdrawals as Withdrawal[]),
          clientReviews: parsed.clientReviews?.length ? parsed.clientReviews : defaultClientReviews,
        };
      } catch (e) {
        console.error("Failed to parse saved user profile", e);
      }
    }
    return {
      name: "",
      avatar: "",
      color: "#e8a87c",
      role: null,
      activeRoleView: "freelancer",
      bio: "",
      location: "",
      skills: ["Figma"],
      verified: [],
      portfolioItems: [],
      verification: {
        status: "unverified",
        method: null,
        value: null,
      },
      isRegistered: false,
      hourlyRate: "$95/hr",
      availability: "available",
      education: [],
      experience: [],
      proposals: [],
      contracts: defaultContracts as ActiveContract[],
      earnings: defaultEarnings,
      withdrawals: defaultWithdrawals as Withdrawal[],
      clientReviews: defaultClientReviews,
    };
  });

  useEffect(() => {
    localStorage.setItem("skillsync_user_profile", JSON.stringify(user));
  }, [user]);

  const signup = (name: string, location: string, color: string) => {
    const initials = name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    setUser((prev) => ({
      ...prev,
      name,
      location,
      color,
      avatar: initials || "U",
      isRegistered: true,
      role: null,
    }));
  };

  const logout = () => {
    setUser({
      name: "",
      avatar: "",
      color: "#e8a87c",
      role: null,
      activeRoleView: "freelancer",
      bio: "",
      location: "",
      skills: ["Figma"],
      verified: [],
      portfolioItems: [],
      verification: {
        status: "unverified",
        method: null,
        value: null,
      },
      isRegistered: false,
      hourlyRate: "$95/hr",
      availability: "available",
      education: [],
      experience: [],
      proposals: [],
      contracts: defaultContracts as ActiveContract[],
      earnings: defaultEarnings,
      withdrawals: defaultWithdrawals as Withdrawal[],
      clientReviews: defaultClientReviews,
    });
    localStorage.removeItem("skillsync_user_profile");
  };

  const setRole = (role: UserRole) => {
    setUser((prev) => {
      const activeRoleView = role === "client" ? "client" : "freelancer";
      return { ...prev, role, activeRoleView };
    });
  };

  const setActiveRoleView = (activeRoleView: RoleView) => {
    setUser((prev) => ({ ...prev, activeRoleView }));
  };

  const updateBio = (bio: string) => {
    setUser((prev) => ({ ...prev, bio }));
  };

  const addSkill = (skill: string) => {
    setUser((prev) => {
      if (prev.skills.includes(skill)) return prev;
      return { ...prev, skills: [...prev.skills, skill] };
    });
  };

  const removeSkill = (skill: string) => {
    setUser((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const updateProfileDetails = (hourlyRate: string, availability: AvailabilityStatus) => {
    setUser((prev) => ({
      ...prev,
      hourlyRate,
      availability,
    }));
  };

  const addEducationEntry = (school: string, degree: string, field: string, startYear: string, endYear: string) => {
    const entry: EducationEntry = {
      id: Date.now().toString(),
      school,
      degree,
      field,
      startYear,
      endYear,
    };
    setUser((prev) => ({
      ...prev,
      education: [...prev.education, entry],
    }));
  };

  const removeEducationEntry = (id: string) => {
    setUser((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addExperienceEntry = (company: string, role: string, startYear: string, endYear: string, desc: string) => {
    const entry: ExperienceEntry = {
      id: Date.now().toString(),
      company,
      role,
      startYear,
      endYear,
      desc,
    };
    setUser((prev) => ({
      ...prev,
      experience: [...prev.experience, entry],
    }));
  };

  const removeExperienceEntry = (id: string) => {
    setUser((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addDetailedPortfolioItem = (
    title: string,
    description: string,
    category: string,
    techUsed: string[],
    image: string,
    link: string
  ) => {
    const item: PortfolioItem = {
      id: Date.now(),
      title,
      description,
      category,
      techUsed,
      image: image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
      link: link || "#",
      metrics: {
        views: (Math.floor(Math.random() * 80) + 10) + "k",
        conversion: "+" + (Math.floor(Math.random() * 30) + 10) + "%",
      },
    };
    setUser((prev) => ({
      ...prev,
      portfolioItems: [...prev.portfolioItems, item],
    }));
  };

  const removePortfolioItem = (id: number) => {
    setUser((prev) => ({
      ...prev,
      portfolioItems: prev.portfolioItems.filter((item) => item.id !== id),
    }));
  };

  const addPortfolioItem = (title: string, category: string, image: string) => {
    addDetailedPortfolioItem(
      title,
      "Simulated work project demonstrating technical excellence.",
      category,
      ["Figma", "Design Systems"],
      image,
      "#"
    );
  };

  const submitProposal = (
    projectId: string,
    projectTitle: string,
    clientName: string,
    bidAmount: string,
    timeline: string,
    coverMessage: string
  ) => {
    const proposal: Proposal = {
      id: Date.now().toString(),
      projectId,
      projectTitle,
      clientName,
      bidAmount,
      timeline,
      coverMessage,
      status: "pending",
      score: Math.floor(Math.random() * 20) + 80, // Dynamic AI matching score
    };
    setUser((prev) => ({
      ...prev,
      proposals: [...prev.proposals, proposal],
    }));
  };

  const addVerifiedBadge = (badgeName: string) => {
    setUser((prev) => {
      if (prev.verified.includes(badgeName)) return prev;
      return {
        ...prev,
        verified: [...prev.verified, badgeName],
      };
    });
  };

  const startVerification = (method: VerificationMethod, value: string): Promise<void> => {
    return new Promise((resolve) => {
      setUser((prev) => ({
        ...prev,
        verification: { status: "verifying", method, value },
      }));

      setTimeout(() => {
        setUser((prev) => {
          const newVerifiedList = [...prev.verified];
          const badge = method === "student_id" ? "Student ID" : "LinkedIn";
          if (!newVerifiedList.includes(badge)) {
            newVerifiedList.push(badge);
          }
          if (!newVerifiedList.includes("Identity")) {
            newVerifiedList.push("Identity");
          }
          return {
            ...prev,
            verified: newVerifiedList,
            verification: {
              status: "verified",
              method,
              value,
            },
          };
        });
        resolve();
      }, 4500);
    });
  };

  const resetVerification = () => {
    setUser((prev) => ({
      ...prev,
      verified: prev.verified.filter((v) => v !== "Student ID" && v !== "LinkedIn" && v !== "Identity"),
      verification: {
        status: "unverified",
        method: null,
        value: null,
      },
    }));
  };

  const updateDeliverableStatus = (
    contractId: string,
    deliverableId: string,
    status: DeliverableStatus
  ) => {
    setUser((prev) => ({
      ...prev,
      contracts: prev.contracts.map((c) => {
        if (c.id !== contractId) return c;
        const deliverables = c.deliverables.map((d) =>
          d.id === deliverableId ? { ...d, status } : d
        );
        const done = deliverables.filter((d) => d.status === "approved").length;
        const progress = Math.round((done / deliverables.length) * 100);
        return { ...c, deliverables, progress };
      }),
    }));
  };

  const uploadContractFile = (contractId: string, fileName: string, fileSize: string) => {
    const file: ContractFile = {
      id: Date.now().toString(),
      name: fileName,
      size: fileSize,
      uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
    setUser((prev) => ({
      ...prev,
      contracts: prev.contracts.map((c) =>
        c.id === contractId ? { ...c, files: [...c.files, file] } : c
      ),
    }));
  };

  const sendContractMessage = (contractId: string, text: string) => {
    const msg: ContractMessage = {
      id: Date.now().toString(),
      from: "freelancer",
      text,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
    setUser((prev) => ({
      ...prev,
      contracts: prev.contracts.map((c) =>
        c.id === contractId ? { ...c, messages: [...c.messages, msg] } : c
      ),
    }));
  };

  const requestWithdrawal = (amount: number, method: string) => {
    if (amount <= 0 || amount > user.earnings.available) return;
    const withdrawal: Withdrawal = {
      id: Date.now().toString(),
      amount,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "processing",
      method,
    };
    setUser((prev) => ({
      ...prev,
      earnings: {
        ...prev.earnings,
        available: prev.earnings.available - amount,
      },
      withdrawals: [withdrawal, ...prev.withdrawals],
    }));
  };

  const roleSelected = user.role !== null;
  const verified = user.verification.status === "verified";
  const bioAdded = user.bio.trim().length > 0;
  const skillsAdded = user.skills.length >= 3;
  const detailsAdded = user.hourlyRate.trim().length > 0 && user.availability !== null;
  const educationAdded = user.education.length >= 1;
  const experienceAdded = user.experience.length >= 1;
  const portfolioAdded = user.portfolioItems.length >= 1;

  let score = 0;
  if (roleSelected) score += 15;
  if (verified) score += 20;
  if (bioAdded) score += 10;
  
  const skillsScore = Math.min(user.skills.length * 3.33, 10);
  score += Math.round(skillsScore);

  if (detailsAdded) score += 10;
  if (educationAdded) score += 10;
  if (experienceAdded) score += 10;
  if (portfolioAdded) score += 15;

  const completeness = {
    score: Math.min(score, 100),
    checklist: {
      roleSelected,
      verified,
      bioAdded,
      skillsAdded,
      detailsAdded,
      educationAdded,
      experienceAdded,
      portfolioAdded,
    },
  };

  return (
    <UserContext.Provider
      value={{
        user,
        signup,
        logout,
        setRole,
        setActiveRoleView,
        updateBio,
        addSkill,
        removeSkill,
        updateProfileDetails,
        addEducationEntry,
        removeEducationEntry,
        addExperienceEntry,
        removeExperienceEntry,
        addDetailedPortfolioItem,
        addPortfolioItem,
        removePortfolioItem,
        submitProposal,
        addVerifiedBadge,
        startVerification,
        resetVerification,
        updateDeliverableStatus,
        uploadContractFile,
        sendContractMessage,
        requestWithdrawal,
        completeness,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

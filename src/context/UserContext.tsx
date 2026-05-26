import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { computeProfileCompleteness, type ProfileCompletenessResult } from "../utils/profileCompleteness";

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
  email: string;
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
  companyName?: string;
  hiringPreferences?: string;
  experienceYears?: string;
  availability?: string;
}

interface StoredAccount {
  email: string;
  password: string;
  profile: UserProfile;
}

const ACCOUNTS_KEY = "skillsync_accounts";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function loadAccounts(): StoredAccount[] {
  const saved = localStorage.getItem(ACCOUNTS_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved) as StoredAccount[];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function makeInitialProfile(): UserProfile {
  return {
    email: "",
    name: "",
    avatar: "",
    color: "#e8a87c",
    role: null,
    activeRoleView: "freelancer",
    bio: "",
    location: "",
    skills: [],
    verified: [],
    portfolioItems: [],
    verification: {
      status: "unverified",
      method: null,
      value: null,
    },
    isRegistered: false,
    companyName: "",
    hiringPreferences: "",
    experienceYears: "",
    availability: "",
  };
}

function initialsFromName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface UserContextType {
  user: UserProfile;
  signup: (
    name: string,
    location: string,
    color: string,
    email: string,
    password: string
  ) => string | null;
  login: (email: string, password: string) => string | null;
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
  updateProfileFields: (fields: Partial<UserProfile>) => void;
  completeness: ProfileCompletenessResult & {
    checklist: ProfileCompletenessResult["checklist"] & {
      clientPrefsAdded: boolean;
      freelancerPrefsAdded: boolean;
    };
  };
  isVerified: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("skillsync_user_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UserProfile;
        return {
          ...makeInitialProfile(),
          ...parsed,
          email: parsed.email ? normalizeEmail(parsed.email) : "",
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
    if (user.isRegistered) {
      localStorage.setItem("skillsync_user_profile", JSON.stringify(user));
    }
  }, [user]);

  const signup = (name: string, location: string, color: string) => {
    const initials = name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const signup = (
    name: string,
    location: string,
    color: string,
    email: string,
    password: string
  ): string | null => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return "Please enter a valid email address.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (loadAccounts().some((a) => normalizeEmail(a.email) === normalizedEmail)) {
      return "An account with this email already exists. Try logging in.";
    }

    const profile: UserProfile = {
      ...makeInitialProfile(),
      email: normalizedEmail,
      name,
      location,
      color,
      avatar: initialsFromName(name) || "U",
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

  const baseCompleteness = useMemo(() => computeProfileCompleteness(user), [user]);

  const clientPrefsAdded =
    (user.companyName?.trim().length || 0) > 0 || (user.hiringPreferences?.trim().length || 0) > 0;
  const freelancerPrefsAdded =
    (user.experienceYears?.trim().length || 0) > 0 || (user.availability?.trim().length || 0) > 0;

  const completeness = useMemo(
    () => ({
      ...baseCompleteness,
      checklist: {
        ...baseCompleteness.checklist,
        clientPrefsAdded,
        freelancerPrefsAdded,
      },
    }),
    [baseCompleteness, clientPrefsAdded, freelancerPrefsAdded]
  );

  const isVerified = user.verification.status === "verified";

  return (
    <UserContext.Provider
      value={{
        user,
        signup,
        login,
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
        isVerified,
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

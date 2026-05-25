import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "freelancer" | "client" | "both" | null;
export type RoleView = "freelancer" | "client";
export type VerificationStatus = "unverified" | "verifying" | "verified";
export type VerificationMethod = "student_id" | "linkedin" | null;

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
  metrics: {
    views: string;
    conversion: string;
  };
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
    skills: ["Figma"],
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
  addPortfolioItem: (title: string, category: string, image: string) => void;
  startVerification: (method: VerificationMethod, value: string) => Promise<void>;
  resetVerification: () => void;
  updateProfileFields: (fields: Partial<UserProfile>) => void;
  completeness: {
    score: number;
    checklist: {
      roleSelected: boolean;
      verified: boolean;
      bioAdded: boolean;
      skillsAdded: boolean;
      portfolioAdded: boolean;
      clientPrefsAdded: boolean;
      freelancerPrefsAdded: boolean;
    };
  };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("skillsync_user_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UserProfile;
        return { ...makeInitialProfile(), ...parsed, email: parsed.email ?? "" };
      } catch (e) {
        console.error("Failed to parse saved user profile", e);
      }
    }
    return makeInitialProfile();
  });

  useEffect(() => {
    if (user.isRegistered) {
      localStorage.setItem("skillsync_user_profile", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (!user.isRegistered || !user.email) return;
    const accounts = loadAccounts();
    const email = normalizeEmail(user.email);
    const idx = accounts.findIndex((a) => normalizeEmail(a.email) === email);
    if (idx >= 0) {
      accounts[idx] = { ...accounts[idx], profile: user };
      saveAccounts(accounts);
    }
  }, [user]);

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
    };

    const accounts = loadAccounts();
    accounts.push({ email: normalizedEmail, password, profile });
    saveAccounts(accounts);
    setUser(profile);
    return null;
  };

  const login = (email: string, password: string): string | null => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      return "Please enter your email.";
    }
    if (!password) {
      return "Please enter your password.";
    }

    const account = loadAccounts().find((a) => normalizeEmail(a.email) === normalizedEmail);
    if (!account) {
      return "No account found with this email. Create an account first.";
    }
    if (account.password !== password) {
      return "Incorrect password. Please try again.";
    }

    setUser({ ...account.profile, email: normalizedEmail, isRegistered: true });
    return null;
  };

  const logout = () => {
    setUser(makeInitialProfile());
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

  const addPortfolioItem = (title: string, category: string, image: string) => {
    setUser((prev) => {
      const newItem: PortfolioItem = {
        id: Date.now(),
        title,
        category,
        image: image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
        metrics: {
          views: "0",
          conversion: "+0%",
        },
      };
      return {
        ...prev,
        portfolioItems: [...prev.portfolioItems, newItem],
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

  const updateProfileFields = (fields: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...fields }));
  };

  const isClient = user.role === "client" || (user.role === "both" && user.activeRoleView === "client");

  const roleSelected = user.role !== null;
  const verified = user.verification.status === "verified";
  const bioAdded = user.bio.trim().length > 0;

  let completeness;

  if (isClient) {
    const clientPrefsAdded = (user.companyName?.trim().length || 0) > 0 || (user.hiringPreferences?.trim().length || 0) > 0;
    
    let completedCount = 0;
    if (roleSelected) completedCount++;
    if (verified) completedCount++;
    if (bioAdded) completedCount++;
    if (clientPrefsAdded) completedCount++;

    const score = Math.round((completedCount / 4) * 100);

    completeness = {
      score,
      checklist: {
        roleSelected,
        verified,
        bioAdded,
        skillsAdded: false,
        portfolioAdded: false,
        clientPrefsAdded,
        freelancerPrefsAdded: false,
      },
    };
  } else {
    const skillsAdded = user.skills.length >= 3;
    const portfolioAdded = user.portfolioItems.length >= 1;
    const freelancerPrefsAdded = (user.experienceYears?.trim().length || 0) > 0 || (user.availability?.trim().length || 0) > 0;

    let completedCount = 0;
    if (roleSelected) completedCount++;
    if (verified) completedCount++;
    if (bioAdded) completedCount++;
    if (skillsAdded) completedCount++;
    if (portfolioAdded) completedCount++;
    if (freelancerPrefsAdded) completedCount++;

    const score = Math.round((completedCount / 6) * 100);

    completeness = {
      score,
      checklist: {
        roleSelected,
        verified,
        bioAdded,
        skillsAdded,
        portfolioAdded,
        clientPrefsAdded: false,
        freelancerPrefsAdded,
      },
    };
  }

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
        addPortfolioItem,
        startVerification,
        resetVerification,
        updateProfileFields,
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

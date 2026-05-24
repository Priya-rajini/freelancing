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
  addPortfolioItem: (title: string, category: string, image: string) => void;
  startVerification: (method: VerificationMethod, value: string) => Promise<void>;
  resetVerification: () => void;
  completeness: {
    score: number;
    checklist: {
      roleSelected: boolean;
      verified: boolean;
      bioAdded: boolean;
      skillsAdded: boolean;
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
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved user profile", e);
      }
    }
    // Return empty profile by default so they must sign up
    return {
      name: "",
      avatar: "",
      color: "#e8a87c",
      role: null,
      activeRoleView: "freelancer",
      bio: "",
      location: "",
      skills: ["Figma"], // Start with a default skill
      verified: [],
      portfolioItems: [],
      verification: {
        status: "unverified",
        method: null,
        value: null,
      },
      isRegistered: false, // Default is not registered
    };
  });

  useEffect(() => {
    localStorage.setItem("skillsync_user_profile", JSON.stringify(user));
  }, [user]);

  const signup = (name: string, location: string, color: string) => {
    // Generate initials for avatar
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
      role: null, // Reset role so they pick role next
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

  const roleSelected = user.role !== null;
  const verified = user.verification.status === "verified";
  const bioAdded = user.bio.trim().length > 0;
  const skillsAdded = user.skills.length >= 3;
  const portfolioAdded = user.portfolioItems.length >= 1;

  let score = 0;
  if (roleSelected) score += 20;
  if (verified) score += 30;
  if (bioAdded) score += 15;
  
  const skillsScore = Math.min(user.skills.length * 5, 15);
  score += skillsScore;

  if (portfolioAdded) score += 20;

  const completeness = {
    score,
    checklist: {
      roleSelected,
      verified,
      bioAdded,
      skillsAdded,
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
        addPortfolioItem,
        startVerification,
        resetVerification,
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

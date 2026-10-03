"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultLanding } from "./defaults";
import type { ExperienceItem, LandingContent } from "./types";
import type { Project } from "../projects";

type CmsContextValue = {
  landing: LandingContent;
  projects: Project[];
  experiences: ExperienceItem[];
};

const CmsContext = createContext<CmsContextValue>({
  landing: defaultLanding,
  projects: [],
  experiences: [],
});

export function CmsProvider({
  landing,
  projects,
  experiences,
  children,
}: CmsContextValue & { children: ReactNode }) {
  return (
    <CmsContext.Provider value={{ landing, projects, experiences }}>{children}</CmsContext.Provider>
  );
}

export function useLanding() {
  return useContext(CmsContext).landing;
}

export function useCmsProjects() {
  return useContext(CmsContext).projects;
}

export function useCmsExperiences() {
  return useContext(CmsContext).experiences;
}

import Finder from "../components/Finder/Finder";
import Settings from "../components/Settings/Settings";
import Terminal from "../components/Terminal/Terminal";
import FileViewer from "../components/FileViewer/FileViewer";
import About from "../pages/About";
import Projects from "../pages/Projects";
import Skills from "../pages/Skills";
import Education from "../pages/Education";
import Achievements from "../pages/Achievements";
import Resume from "../pages/Resume";
import Contact from "../pages/Contact";
import Safari from "../pages/Safari";
import Music from "../pages/Music";
import PageWindow from "../components/Window/PageWindow";
import { createElement } from "react";

export const appRegistry = {
  finder: {
    id: "finder",
    title: "Finder",
    component: Finder,
  },
  settings: {
    id: "settings",
    title: "Settings",
    component: Settings,
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    component: Terminal,
  },
  fileviewer: {
    id: "fileviewer",
    title: "File Viewer",
    component: FileViewer,
  },
  about: {
    id: "about",
    title: "About",
    component: (props) =>
      createElement(PageWindow, {
        ...props,
        title: "About",
        Component: About,
      }),
  },
  projects: {
    id: "projects",
    title: "Projects",
    component: (props) =>
      createElement(PageWindow, {
        ...props,
        title: "Projects",
        Component: Projects,
      }),
  },
  skills: {
    id: "skills",
    title: "Skills",
    component: (props) =>
      createElement(PageWindow, {
        ...props,
        title: "Skills",
        Component: Skills,
      }),
  },
  education: {
    id: "education",
    title: "Education",
    component: (props) =>
      createElement(PageWindow, {
        ...props,
        title: "Education",
        Component: Education,
      }),
  },
  achievements: {
    id: "achievements",
    title: "Achievements",
    component: (props) =>
      createElement(PageWindow, {
        ...props,
        title: "Achievements",
        Component: Achievements,
      }),
  },
  resume: {
    id: "resume",
    title: "Resume",
    component: (props) =>
      createElement(PageWindow, {
        ...props,
        title: "Resume",
        Component: Resume,
      }),
  },
  contact: {
    id: "contact",
    title: "Contact",
    component: (props) =>
      createElement(PageWindow, {
        ...props,
        title: "Contact",
        Component: Contact,
      }),
  },
  safari: {
    id: "safari",
    title: "Safari",
    component: (props) =>
      createElement(PageWindow, {
        ...props,
        title: "Safari",
        Component: Safari,
      }),
  },
  music: {
    id: "music",
    title: "Music",
    component: (props) =>
      createElement(PageWindow, {
        ...props,
        title: "Music",
        Component: Music,
      }),
  },
};

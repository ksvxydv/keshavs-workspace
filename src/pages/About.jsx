import { profile } from "../data/profile";
import { education } from "../data/education";
import { social } from "../data/social";
import profilePhoto from "../assets/profile/ProfilePhoto.png";
import leetcodeLogo from "../assets/social/leetcodeLogo.png";
import codeforcesLogo from "../assets/social/codeforceslogo.png";
import githubLogo from "../assets/social/githubLogo.svg";
import linkedinLogo from "../assets/social/linkedinLogo.png";
import mnnitLogo from "../assets/education/mnnitLogo.png";
import { GraduationCap, MapPin, Code2, Rocket } from "lucide-react";
import { getTerminalActions } from "../terminal/terminalActions";
import Page from "../components/ui/Page";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";

export default function About() {
  const primaryEducation = education[0];
  const actions = getTerminalActions();

  const socialLinks = [
    { icon: githubLogo, alt: "GitHub", url: social.github.url },
    { icon: linkedinLogo, alt: "LinkedIn", url: social.linkedin.url },
    { icon: leetcodeLogo, alt: "LeetCode", url: social.leetcode.url },
    { icon: codeforcesLogo, alt: "Codeforces", url: social.codeforces.url },
  ];

  return (
    <Page>
      <div className="h-full overflow-y-auto p-5 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <Card className="p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div
                className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border sm:h-32 sm:w-32"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--border) 85%, transparent)",
                  boxShadow: "0 12px 30px rgba(0,0,0,.16)",
                }}
              >
                <img
                  src={profilePhoto}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>

              <div className="min-w-0 flex-1">
                <PageHeader
                  eyebrow="Portfolio / About"
                  title={profile.name}
                  description={profile.bio}
                  actions={
                    <div className="flex flex-wrap gap-3">
                      <PrimaryButton
                        onClick={() => actions.openWindow?.("resume")}
                      >
                        Resume
                      </PrimaryButton>

                      <SecondaryButton
                        onClick={() => actions.openWindow?.("contact")}
                      >
                        Contact
                      </SecondaryButton>
                    </div>
                  }
                />

                <div className="mt-6 flex flex-wrap gap-3">
                  {socialLinks.map(({ icon, alt, url }) => (
                    <a
                      key={alt}
                      href={url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={alt}
                      className="group flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      style={{
                        background:
                          "color-mix(in srgb, var(--window-secondary) 78%, transparent)",
                        borderColor:
                          "color-mix(in srgb, var(--border) 82%, transparent)",
                      }}
                    >
                      <img
                        src={icon}
                        alt=""
                        className={`h-6 w-6 object-contain transition-transform duration-200 group-hover:scale-105${alt === "GitHub" ? " github-logo" : ""}`}
                        draggable={false}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card interactive>
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <GraduationCap size={18} style={{ color: "var(--accent)" }} />
                Education
              </h2>

              <div className="mt-5 flex items-center gap-4">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-2"
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--border) 82%, transparent)",
                  }}
                >
                  <img
                    src={mnnitLogo}
                    alt={primaryEducation.shortName}
                    className="h-full w-full object-contain"
                    draggable={false}
                  />
                </div>

                <div className="min-w-0 space-y-1">
                  <p className="font-semibold">{primaryEducation.shortName}</p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {primaryEducation.degree}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {primaryEducation.branch}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {primaryEducation.duration}
                  </p>
                </div>
              </div>
            </Card>

            <Card interactive>
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <MapPin size={18} style={{ color: "var(--accent)" }} />
                Location
              </h2>

              <p
                className="mt-5 text-sm leading-6"
                style={{ color: "var(--text-secondary)" }}
              >
                {profile.location}
              </p>
            </Card>

            <Card interactive>
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Code2 size={18} style={{ color: "var(--accent)" }} />
                Interests
              </h2>

              <p
                className="mt-5 text-sm leading-6"
                style={{ color: "var(--text-secondary)" }}
              >
                {profile.currentFocus.join(" • ")}
              </p>
            </Card>

            <Card interactive>
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Rocket size={18} style={{ color: "var(--accent)" }} />
                Current Goal
              </h2>

              <p
                className="mt-5 text-sm leading-6"
                style={{ color: "var(--text-secondary)" }}
              >
                Building high-quality software and preparing for internships.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
}

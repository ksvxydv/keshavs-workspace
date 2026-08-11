import Page from "../components/ui/Page";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import MetaChip from "../components/ui/MetaChip";
import {
  HiAcademicCap,
  HiCamera,
  HiUserGroup,
  HiCommandLine,
  HiTrophy,
} from "react-icons/hi2";

const achievements = [
  {
    icon: HiAcademicCap,
    title: "B.Tech in Computer Science & Engineering",
    organization: "MNNIT Allahabad",
    year: "2025",
    description:
      "Started my undergraduate journey in Computer Science & Engineering.",
    badge: "Education",
  },
  {
    icon: HiCamera,
    title: "Media Specialist",
    organization: "MNNIT Times",
    year: "2025",
    description:
      "Contributing to media and creative initiatives within the institute.",
    badge: "Leadership",
  },
  {
    icon: HiUserGroup,
    title: "Educator",
    organization: "Anokhi Pehel",
    year: "2025",
    description:
      "Teaching and mentoring school students through the social initiative.",
    badge: "Community",
  },
  {
    icon: HiCommandLine,
    title: "K_OS Portfolio",
    organization: "Personal Project",
    year: "2026",
    description:
      "Designed and built a macOS-inspired interactive portfolio using React.",
    badge: "Development",
  },
];

export default function Achievements() {
  return (
    <Page>
      <div className="h-full overflow-y-auto p-5 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <Card>
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border"
                style={{
                  background:
                    "color-mix(in srgb, var(--accent) 12%, transparent)",
                  borderColor:
                    "color-mix(in srgb, var(--accent) 28%, transparent)",
                  color: "var(--accent)",
                }}
              >
                <HiTrophy className="h-8 w-8" />
              </div>

              <PageHeader
                eyebrow="Portfolio / Achievements"
                title="Achievements & Milestones"
                description="A timeline of academic progress, leadership, community work, and software development."
                actions={
                  <div className="flex flex-wrap gap-2">
                    <MetaChip>2025–Present</MetaChip>
                    <MetaChip>{achievements.length} Milestones</MetaChip>
                    <MetaChip tone="accent">3 Organizations</MetaChip>
                  </div>
                }
              />
            </div>
          </Card>

          <div className="space-y-4">
            {achievements.map((item, index) => {
              const Icon = item.icon;
              const hasNextItem = index < achievements.length - 1;

              return (
                <div
                  key={item.title}
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-4"
                >
                  <div className="flex w-4 flex-col items-center">
                    <span
                      className="mt-7 h-4 w-4 shrink-0 rounded-full border-4"
                      style={{
                        background: "var(--accent)",
                        borderColor: "var(--window)",
                        boxShadow:
                          "0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent)",
                      }}
                    />
                    {hasNextItem && (
                      <span
                        className="mt-2 w-px flex-1"
                        style={{
                          background:
                            "color-mix(in srgb, var(--border) 88%, transparent)",
                        }}
                      />
                    )}
                  </div>

                  <Card interactive>
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          background:
                            "color-mix(in srgb, var(--accent) 12%, transparent)",
                          color: "var(--accent)",
                        }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h2 className="text-lg font-semibold">
                              {item.title}
                            </h2>
                            <p
                              className="mt-1 text-sm font-medium"
                              style={{ color: "var(--accent)" }}
                            >
                              {item.organization}
                            </p>
                          </div>

                          <MetaChip>{item.year}</MetaChip>
                        </div>

                        <div className="mt-4">
                          <MetaChip tone="accent">{item.badge}</MetaChip>
                        </div>

                        <p
                          className="mt-4 text-sm leading-6"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}

            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
              <div className="flex w-4 justify-center">
                <span
                  className="mt-7 h-4 w-4 rounded-full border-4"
                  style={{
                    background: "var(--window-secondary)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>

              <Card>
                <h2 className="text-lg font-semibold">Coming Soon</h2>
                <p
                  className="mt-3 text-sm leading-6"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Future milestones including hackathons, internships,
                  certifications, open-source contributions, and research
                  projects will appear here.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

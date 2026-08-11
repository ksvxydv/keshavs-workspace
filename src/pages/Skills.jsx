import Page from "../components/ui/Page";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import MetaChip from "../components/ui/MetaChip";
import { skills } from "../data/skills";
import { HiCodeBracketSquare } from "react-icons/hi2";

const categoryDescriptions = {
  Languages: "Programming languages I use for problem solving and development.",
  Frontend: "Libraries and frameworks for polished web interfaces.",
  Tools: "Tools that support my everyday development workflow.",
  Learning: "Topics and technologies I am currently exploring.",
};

const categoryLabels = {
  Languages: "Programming Language",
  Frontend: "Framework / Library",
  Tools: "Development Tool",
  Learning: "Currently Exploring",
};

export default function Skills() {
  const categories = [
    { title: "Languages", items: skills.programming },
    { title: "Frontend", items: skills.frontend },
    { title: "Tools", items: skills.tools },
    { title: "Learning", items: skills.currentlyLearning },
  ];

  return (
    <Page>
      <div className="h-full overflow-y-auto p-5 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
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
                <HiCodeBracketSquare className="h-8 w-8" />
              </div>

              <PageHeader
                eyebrow="Portfolio / Skills"
                title="Skills & Technologies"
                description="Technologies, frameworks, and tools I use to build thoughtful software while strengthening my computer science foundation."
                actions={
                  <div className="flex flex-wrap gap-2">
                    <MetaChip>{skills.programming.length} Languages</MetaChip>
                    <MetaChip>{skills.frontend.length} Frontend</MetaChip>
                    <MetaChip>{skills.tools.length} Tools</MetaChip>
                    <MetaChip tone="accent">
                      {skills.currentlyLearning.length} Learning
                    </MetaChip>
                  </div>
                }
              />
            </div>
          </Card>

          <div className="grid gap-4 xl:grid-cols-2">
            {categories.map((category) => (
              <Card key={category.title}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{category.title}</h2>
                    <p
                      className="mt-1 text-sm leading-6"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {categoryDescriptions[category.title]}
                    </p>
                  </div>

                  <MetaChip>{category.items.length}</MetaChip>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {category.items.map((skill) => {
                    const Icon = skill.icon;

                    return (
                      <div
                        key={skill.name}
                        className="group flex min-h-32 flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        style={{
                          background:
                            "color-mix(in srgb, var(--window-secondary) 78%, transparent)",
                          borderColor:
                            "color-mix(in srgb, var(--border) 76%, transparent)",
                        }}
                      >
                        <Icon
                          size={34}
                          className="transition-transform duration-200 group-hover:scale-105"
                          style={{ color: skill.color }}
                        />

                        <p className="mt-3 text-sm font-semibold">
                          {skill.name}
                        </p>
                        <p
                          className="mt-1 text-[11px]"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {categoryLabels[category.title]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

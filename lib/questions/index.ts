import type { ProjectType, Question } from "@/types";
import { kitchenQuestions } from "./kitchen";
import { bathroomQuestions } from "./bathroom";
import { laundryQuestions } from "./laundry";
import { livingQuestions } from "./living";
import { outdoorQuestions } from "./outdoor";

const QUESTION_SETS: Record<ProjectType, Question[]> = {
  kitchen: kitchenQuestions,
  bathroom: bathroomQuestions,
  laundry: laundryQuestions,
  living: livingQuestions,
  outdoor: outdoorQuestions,
};

export function getQuestionsForProject(projectType: ProjectType): Question[] {
  return QUESTION_SETS[projectType] || [];
}

export { kitchenQuestions, bathroomQuestions, laundryQuestions, livingQuestions, outdoorQuestions };

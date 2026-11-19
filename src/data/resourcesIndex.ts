import { StudyResource } from "./resources/types";
import { physicsResources } from "./resources/physicsResources";
import { chemistryResources } from "./resources/chemistryResources";
import { mathResources } from "./resources/mathResources";

export * from "./resources/types";
export { physicsResources, chemistryResources, mathResources };

export const allStudyResources: StudyResource[] = [
  ...physicsResources,
  ...chemistryResources,
  ...mathResources
];

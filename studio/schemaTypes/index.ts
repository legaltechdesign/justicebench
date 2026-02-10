// schemas/index.ts
import project from './project'
import task from './task'
import dataset from './dataset'
import guide from './guide'
import evaluation from './evaluation'
import category from './category'
import status from './status'
import issue from './issue'
import jurisdiction from './jurisdiction'
import benchmark from './benchmark'

import playbook from "./playbook";

import playbookFreeform from "./playbookFreeform";
import playbookProblemFrame from "./playbookProblemFrame";
import playbookUserJourney from "./playbookUserJourney";
import playbookEvaluation from "./playbookEvaluation";
import playbookArchitecture from "./playbookArchitecture";
import playbookImplementationPatterns from "./playbookImplementationPatterns";
import playbookFailureModes from "./playbookFailureModes";
import playbookAssets from "./playbookAssets";
import playbookHero from "./playbookHero";
import playbookDecisionRecord from "./playbookDecisionRecord";
import playbookOpenQuestions from "./playbookOpenQuestions";

import journeyStep from "./journeyStep";
import architectureLayer from "./architectureLayer";
import implementationPattern from "./implementationPattern";
import failureMode from "./failureMode";
import assetLink from "./assetLink";

// optional
import seoFields from "./seoFields";
import link from "./link";

export const schemaTypes = [
// helpers
  journeyStep,
  architectureLayer,
  implementationPattern,
  failureMode,
  assetLink,
  seoFields,
  link,

   // playbook section objects
 
   // playbook section objects
  playbookHero,
  playbookProblemFrame,
  playbookUserJourney,
  playbookArchitecture,
  playbookImplementationPatterns,
  playbookFailureModes,
  playbookEvaluation,
  playbookAssets,
  playbookDecisionRecord,
  playbookOpenQuestions,
  playbookFreeform,


   // document
  playbook,

  task, 
  project, 
  dataset, 
  guide, 
  evaluation, 
  category, 
  status, 
  issue, 
  jurisdiction, 
  benchmark
]
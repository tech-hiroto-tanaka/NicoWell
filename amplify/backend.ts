import { defineBackend } from "@aws-amplify/backend";
import { analysisFunction } from './analysis-function/resource';
import { chatFunction } from './chat-function/resource';
import { surveyFunction } from './survey-function/resource';

defineBackend({
  analysisFunction,
  chatFunction,
  surveyFunction
});
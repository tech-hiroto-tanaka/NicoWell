import { defineFunction } from "@aws-amplify/backend";
    
export const surveyFunction = defineFunction({
  name: "survey-function",
  entry: "./handler.ts"
});
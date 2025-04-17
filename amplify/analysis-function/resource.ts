import { defineFunction } from "@aws-amplify/backend";
    
export const analysisFunction = defineFunction({
  name: "analysis-function",
  entry: "./handler.ts"
});
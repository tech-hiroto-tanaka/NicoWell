import { defineFunction } from "@aws-amplify/backend";
    
export const chatFunction = defineFunction({
  name: "chat-function",
  entry: "./handler.ts"
});
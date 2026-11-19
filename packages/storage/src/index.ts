import dbConnect from "./lib/mongodb.js";

export { dbConnect };
export * from "./context/context.model.js";
export * from "./scan/scan.model.js";
export * from "./scanProfile/scanProfile.model.js";

// Re-exported so consumers share storage's typegoose/mongoose instance;
// isDocument() relies on instanceof checks against that instance.
export { isDocument, type DocumentType } from "@typegoose/typegoose";

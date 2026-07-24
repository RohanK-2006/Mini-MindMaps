import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { MindmapPrompt } from "../utils/Prompts.js";

dotenv.config();

const AiRoutes = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const isNonEmptyString = (value) =>
    typeof value === "string" && value.trim().length > 0;

const validateMindmapResponse = (mindmap) => {
    const errors = [];

    if (!mindmap || typeof mindmap !== "object") {
        return ["Response is not a valid JSON object"];
    }

    if (!isNonEmptyString(mindmap.title)) {
        errors.push("title must be a non-empty string");
    }

    if (!isNonEmptyString(mindmap.rootId)) {
        errors.push("rootId must be a non-empty string");
    }

    if (!Array.isArray(mindmap.nodes)) {
        errors.push("nodes must be an array");
    } else {
        if (mindmap.nodes.length < 5 || mindmap.nodes.length > 9) {
            errors.push("nodes must contain between 5 and 9 items");
        }

        const nodeIds = new Set();

        mindmap.nodes.forEach((node, index) => {
            if (!node || typeof node !== "object") {
                errors.push(`nodes[${index}] must be an object`);
                return;
            }

            if (!isNonEmptyString(node.id)) {
                errors.push(`nodes[${index}].id must be a non-empty string`);
            } else {
                if (nodeIds.has(node.id)) {
                    errors.push(`nodes[${index}].id must be unique`);
                }
                nodeIds.add(node.id);
            }

            if (!isNonEmptyString(node.label)) {
                errors.push(`nodes[${index}].label must be a non-empty string`);
            }

            if (!isNonEmptyString(node.summary)) {
                errors.push(`nodes[${index}].summary must be a non-empty string`);
            }
        });

        if (isNonEmptyString(mindmap.rootId) && !nodeIds.has(mindmap.rootId)) {
            errors.push("rootId must match one node id");
        }
    }

    if (!Array.isArray(mindmap.connections)) {
        errors.push("connections must be an array");
    } else {
        mindmap.connections.forEach((connection, index) => {
            if (!connection || typeof connection !== "object") {
                errors.push(`connections[${index}] must be an object`);
                return;
            }

            if (!isNonEmptyString(connection.from)) {
                errors.push(`connections[${index}].from must be a non-empty string`);
            }

            if (!isNonEmptyString(connection.to)) {
                errors.push(`connections[${index}].to must be a non-empty string`);
            }

            if (!isNonEmptyString(connection.label)) {
                errors.push(`connections[${index}].label must be a non-empty string`);
            }
        });
    }

    return errors;
};

AiRoutes.post("/mindmaps", async (req, res) => {
    try {
        const { textInput } = req.body;

        if (!textInput || typeof textInput !== "string" || !textInput.trim()) {
            return res.status(400).json({
                message: "textInput is required",
            });
        }

        console.log("Received textInput:", textInput);

        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: MindmapPrompt(textInput),
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                type: "OBJECT",
                properties: {
                    title: { type: "STRING" },
                    rootId: { type: "STRING" },
                    nodes: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                        id: { type: "STRING" },
                        label: { type: "STRING" },
                        summary: { type: "STRING" },
                        },
                        required: ["id", "label", "summary"],
                    },
                    },
                    connections: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                        from: { type: "STRING" },
                        to: { type: "STRING" },
                        label: { type: "STRING" },
                        },
                        required: ["from", "to", "label"],
                    },
                    },
                },
                required: ["title", "rootId", "nodes", "connections"],
                },
            },
        });

                console.log("AI response: ", response);

                if (!isNonEmptyString(response?.text)) {
                    return res.status(502).json({
                        message: "AI returned an empty or invalid text response",
                    });
                }

                let mindmap;
                try {
                    mindmap = JSON.parse(response.text);
                } catch {
                    return res.status(502).json({
                        message: "AI response is not valid JSON",
                        raw: response.text,
                    });
                }

                const validationErrors = validateMindmapResponse(mindmap);
                if (validationErrors.length > 0) {
                    return res.status(502).json({
                        message: "AI response does not match required mindmap format",
                        errors: validationErrors,
                    });
                }

                console.log("Parsed Mindmap: ", mindmap);
        

        return res.status(200).json(mindmap);
    } catch (error) {
        console.error("Error in /mindmaps route:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


export default AiRoutes;
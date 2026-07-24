export const MindmapPrompt = (textInput) => `
You are an expert at analyzing text and extracting its core concepts into a concise knowledge graph.

Your task is to generate a mindmap from the provided text.

Guidelines:

- Read the entire input carefully before identifying concepts.
- Identify the single most important topic as the root node.
- Create between 5 and 9 total nodes, including the root.
- Each node should represent a meaningful concept, not a sentence.
- Keep each node label between 1 and 4 words.
- Write exactly one clear sentence as the summary for each node.
- Connect nodes using meaningful relationships such as:
  - contains
  - part of
  - causes
  - leads to
  - depends on
  - includes
  - influences
  - requires
  - supports
  Use whichever relationship best describes the connection.
- Every node except the root should be connected to at least one other node.
- Ensure the mindmap forms one connected graph.
- Focus on the most important information instead of minor details.
- Do not invent facts that are not supported by the input.
- If multiple topics exist, organize them under the main topic.

Generate a concise, logically organized mindmap that would help someone quickly understand the document.

Input:

${textInput}
`
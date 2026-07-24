export type MindmapNode = {
  id: string; // stable and unique within the mindmap
  label: string; // 1-4 words
  summary: string; // one sentence
};

export type MindmapConnection = {
  from: string; // node id
  to: string; // node id
  label: string; // relationship label, e.g. "causes" or "part of"
};

export type Mindmap = {
  title: string;
  rootId: string; // must match one node's id
  nodes: MindmapNode[]; // 5-9 nodes total, including the root
  connections: MindmapConnection[];
};
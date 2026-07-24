import { randomUUID } from "crypto";

export const mockMindmap = 
{
  id: randomUUID(),
  createdAt: new Date().toISOString(),
  title: 'Mock Mindmap Example',
  rootId: 'iot',
  nodes: [
    {
      id: 'iot',
      label: 'Internet of Things',
      summary: 'The Internet of Things is a network of interconnected physical devices capable of collecting and exchanging data.'
    },
    {
      id: 'devices',
      label: 'Physical Devices',
      summary: 'These encompass a wide range of hardware like wearables, sensors, and connected vehicles.'
    },
    {
      id: 'infrastructure',
      label: 'System Infrastructure',
      summary: 'IoT systems require sensors, communication networks, and cloud platforms to function effectively.'
    },
    {
      id: 'applications',
      label: 'Industry Applications',
      summary: 'IoT technology drives improvements in efficiency and decision-making across sectors like healthcare and manufacturing.'
    },
    {
      id: 'challenges',
      label: 'Adoption Challenges',
      summary: 'Widespread implementation faces obstacles including cybersecurity risks, privacy concerns, and technical interoperability.'
    },
    {
      id: 'future',
      label: 'Future Evolution',
      summary: 'Advancements in AI and 5G connectivity are set to enhance the intelligence and scalability of IoT.'
    }
  ],
  connections: [
    { from: 'iot', to: 'devices', label: 'includes' },
    { from: 'iot', to: 'infrastructure', label: 'requires' },
    { from: 'iot', to: 'applications', label: 'influences' },
    { from: 'iot', to: 'challenges', label: 'faces' },
    { from: 'iot', to: 'future', label: 'leads to' }
  ]
}

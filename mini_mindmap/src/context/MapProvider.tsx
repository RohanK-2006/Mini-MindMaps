import axios from "axios";
import { createContext, useContext, useState } from "react";
import type { Mindmap } from "../types/types";

interface MapContextType {
  map: Mindmap | null;
  getMap: (textInput: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  selectedNodeId: string | null;
  setSelectedNodeId: (nodeId: string | null) => void;
}

const MapContext = createContext<MapContextType>({
  map: null,
  getMap: async () => {
    throw new Error("MapContext not initialized");
  },
  loading: false,
  error: null,
  selectedNodeId: null,
  setSelectedNodeId: () => {},
});

export const useMap = () => useContext(MapContext);

const MapProvider = ({ children } : { children: React.ReactNode }) => {

    const [map, setMap] = useState<Mindmap | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const getMap = async (textInput: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/mindmaps",
        {
          textInput
        }
      );
      setMap(response.data);
      setSelectedNodeId(response.data?.rootId ?? null);
    } catch (requestError) {
      setMap(null);
      setSelectedNodeId(null);

      if (axios.isAxiosError(requestError)) {
        const responseMessage = requestError.response?.data?.message;
        const validationErrors = requestError.response?.data?.errors;
        const rawMessage = Array.isArray(validationErrors)
          ? validationErrors.join("; ")
          : null;

        setError(responseMessage ?? rawMessage ?? requestError.message ?? "Failed to generate mindmap");
      } else {
        setError(requestError instanceof Error ? requestError.message : "Failed to generate mindmap");
      }
    } finally {
      setLoading(false);
    }
    };

    return (
    <MapContext.Provider value={{ map, getMap, loading, error, selectedNodeId, setSelectedNodeId }}>
            {children}
        </MapContext.Provider>
    )
}

export default MapProvider;
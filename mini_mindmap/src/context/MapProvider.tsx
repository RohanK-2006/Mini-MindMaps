import axios from "axios";
import { createContext, useContext, useState } from "react";
import type { Mindmap } from "../types/types";

interface MapContextType {
  map: Mindmap | null;
  getMap: (textInput: string) => Promise<void>;
  loading: boolean;
}

const MapContext = createContext<MapContextType>({
  map: null,
  getMap: async () => {
    throw new Error("MapContext not initialized");
  },
  loading: false,
});

export const useMap = () => useContext(MapContext);

const MapProvider = ({ children } : { children: React.ReactNode }) => {

    const [map, setMap] = useState<Mindmap | null>(null);
    const [loading, setLoading] = useState(false);

    const getMap = async (textInput: string) => {
        setLoading(true);
        const response = await axios.post(
            "http://localhost:5000/api/mindmaps",
            {
                textInput
            }
        );
        setLoading(false);
        setMap(response.data);
    };

    return (
        <MapContext.Provider value={{ map, getMap, loading }}>
            {children}
        </MapContext.Provider>
    )
}

export default MapProvider;
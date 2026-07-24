import { createContext, useContext, useState } from "react";

interface MockContextType {
    mock_mode: boolean;
    toggle_mock_mode: () => void;
}


const MockContext = createContext<MockContextType>({
    mock_mode:false,
    toggle_mock_mode: () => {},
})

export const useMock = () => useContext(MockContext);

const MockProvider = ({ children } : { children: React.ReactNode }) => {
    const [mock_mode, setMockMode] = useState<boolean>(false);

    const toggle_mock_mode = () => {
        setMockMode(!mock_mode);
    }
    
    return (
        <MockContext.Provider value={{mock_mode, toggle_mock_mode}}>
            {children}
        </MockContext.Provider>
    )
}

export default MockProvider;
import { createContext, useContext, useState } from "react";



const PlatformContext = createContext();

export const usePlatformContext = () => useContext(PlatformContext);

export const PlatformProvider = ({ children }) => {

    const PLATFORMS = ['ebay', 'poshmark', 'depop']
    const [selectedPlatforms, setSelectedPlatforms] = useState(PLATFORMS)

    
    return (
        <PlatformContext.Provider value={ { PLATFORMS, selectedPlatforms, setSelectedPlatforms }}>
            {children}
        </PlatformContext.Provider>
    );
}
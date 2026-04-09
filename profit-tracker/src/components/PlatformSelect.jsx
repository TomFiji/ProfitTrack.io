import { Checkbox, Group } from "@mantine/core";
import { usePlatformContext } from "../contexts/PlatformContext";
import '../css/PlatformCheckbox.css';

function PlatformSelect() {
    const { PLATFORMS, selectedPlatforms, setSelectedPlatforms } = usePlatformContext();

    const handleChange = (platform, checked) => {
        if (checked) {
            setSelectedPlatforms(prev => [...prev, platform]);
        } else {
            setSelectedPlatforms(prev => prev.filter(p => p !== platform));
        }
    };

    return (
        <Group className="platform-checkbox">
            {PLATFORMS.map(platform => (
                <Checkbox
                    key={platform}
                    label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    checked={selectedPlatforms.includes(platform)}
                    onChange={(e) => handleChange(platform, e.currentTarget.checked)}
                />
            ))}
        </Group>
    );

}

export default PlatformSelect

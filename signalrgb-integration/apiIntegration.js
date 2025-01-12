const axios = require('axios');

const baseURL = 'http://127.0.0.1:16038/api/v1'; // Replace with your SignalRGB server URL

async function getCurrentEffect() {
    try {
        const response = await axios.get(`${baseURL}/lighting`);
        console.log('Current Effect:', response.data.data.attributes.name);
    } catch (error) {
        console.error('Error fetching current effect:', error);
    }
}

async function setGlobalBrightness(brightness) {
    try {
        const response = await axios.patch(`${baseURL}/lighting/global_brightness`, { global_brightness: brightness });
        console.log('Global Brightness set to:', brightness);
    } catch (error) {
        console.error('Error setting global brightness:', error);
    }
}

async function toggleCanvas(enabled) {
    try {
        const response = await axios.patch(`${baseURL}/lighting/enabled`, { enabled });
        console.log(`Canvas ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
        console.error('Error toggling canvas:', error);
    }
}

async function getInstalledEffects() {
    try {
        const response = await axios.get(`${baseURL}/lighting/effects`);
        console.log('Installed Effects:', response.data.data.map(effect => effect.attributes.name));
    } catch (error) {
        console.error('Error fetching installed effects:', error);
    }
}

async function applyEffect(effectId) {
    try {
        const response = await axios.post(`${baseURL}/lighting/effect/${effectId}/apply`);
        console.log(`Effect ${effectId} applied`);
    } catch (error) {
        console.error(`Error applying effect ${effectId}:`, error);
    }
}

async function nextEffect() {
    try {
        const response = await axios.post(`${baseURL}/lighting/next`);
        console.log('Next effect applied');
    } catch (error) {
        console.error('Error applying next effect:', error);
    }
}

async function previousEffect() {
    try {
        const response = await axios.post(`${baseURL}/lighting/previous`);
        console.log('Previous effect applied');
    } catch (error) {
        console.error('Error applying previous effect:', error);
    }
}

async function shuffleEffects() {
    try {
        const response = await axios.post(`${baseURL}/lighting/shuffle`);
        console.log('Effects shuffled');
    } catch (error) {
        console.error('Error shuffling effects:', error);
    }
}

async function getColorAtPosition(x, y) {
    try {
        const response = await axios.get(`${baseURL}/device/color`, { params: { x, y } });
        console.log('Color at position:', response.data.data.attributes.color);
    } catch (error) {
        console.error('Error fetching color at position:', error);
    }
}

async function getBrightness() {
    try {
        const response = await axios.get(`${baseURL}/device/brightness`);
        console.log('Current Brightness:', response.data.data.attributes.brightness);
    } catch (error) {
        console.error('Error fetching brightness:', error);
    }
}

async function getMotherboardName() {
    try {
        const response = await axios.get(`${baseURL}/device/motherboard_name`);
        console.log('Motherboard Name:', response.data.data.attributes.name);
    } catch (error) {
        console.error('Error fetching motherboard name:', error);
    }
}

async function pauseDevice(duration) {
    try {
        const response = await axios.post(`${baseURL}/device/pause`, { duration });
        console.log(`Device paused for ${duration} milliseconds`);
    } catch (error) {
        console.error('Error pausing device:', error);
    }
}

async function setEndpoint(interface, usage, usage_page, collection) {
    try {
        const response = await axios.post(`${baseURL}/device/endpoint`, { interface, usage, usage_page, collection });
        console.log('Endpoint set successfully');
    } catch (error) {
        console.error('Error setting endpoint:', error);
    }
}

// Example usage
getCurrentEffect();
setGlobalBrightness(50); // Set brightness to 50%
toggleCanvas(false); // Disable canvas
getInstalledEffects();
applyEffect('Neon Shift'); // Apply Neon Shift effect
nextEffect();
previousEffect();
shuffleEffects();
getColorAtPosition(5, 3); // Get color at position (5, 3)
getBrightness();
getMotherboardName();
pauseDevice(1000); // Pause device for 1 second
setEndpoint(0x0002, 0x0006, 0x0080, 0x0001); // Set endpoint

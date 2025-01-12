import sacn from 'sacn';
import { execFileSync } from 'child_process'; // Use import statement for child_process

let sacnSenders = [];
let running = false;
let universeCount = 10;
let frameRate = 30;
let fixturesPerUniverse = Math.floor(512 / 4);
let lastRenderTime = 0;

// Default position and scale
let defaultPosition = [0, 0];
let defaultScale = 1.0;

// Define LED positions on SignalRGB layout
let ledPositions = [
    [0, 0], // LED 1 Position
    [1, 0], // LED 2 Position
    [2, 0]  // LED 3 Position
];

export function Name() { return "SignalRGBToSACN"; }
export function VendorId() { return 1234; } // Replace with actual Vendor ID
export function ProductId() { return 5678; } // Replace with actual Product ID
export function Publisher() { return "DR.U"; }
export function Documentation() { return "https://docs.signalrgb.com/plugins"; }
export function Size() { return [1, 1]; }

export function ControllableParameters() {
    return [
        { "property": "shutdownColor", "group": "lighting", "label": "Shutdown Color", "min": "0", "max": "360", "type": "color", "default": "009bde" },
        { "property": "LightingMode", "group": "lighting", "label": "Lighting Mode", "type": "combobox", "values": ["Canvas", "Forced"], "default": "Canvas" },
        { "property": "forcedColor", "group": "lighting", "label": "Forced Color", "min": "0", "max": "360", "type": "color", "default": "009bde" },
        { "property": "position", "group": "layout", "label": "Default Position", "type": "position", "default": defaultPosition },
        { "property": "scale", "group": "layout", "label": "Default Scale", "type": "scale", "default": defaultScale },
        { "property": "brightness", "group": "lighting", "label": "Brightness", "type": "slider", "min": 0, "max": 255, "default": 128 }
    ];
}

export function DeviceMapping() {
    return [
        { led: 0, zone: "Zone 1" },
        { led: 1, zone: "Zone 2" },
        { led: 2, zone: "Zone 3" }
    ];
}

export function Initialize() {
    // Initialize sACN senders for each universe
    for (let i = 0; i < universeCount; i++) {
        try {
            const sender = new sacn.Sender({
                universe: i + 1,
                reuseAddr: true,
            });

            sender.on('error', (err) => {
                console.error(`sACN Error in Universe ${i + 1}:`, err);
            });

            sacnSenders.push(sender);
        } catch (err) {
            console.error(`Failed to initialize sACN sender for Universe ${i + 1}:`, err);
        }
    }

    running = true;
    console.log("SignalRGB to sACN plugin initialized and running.");
}

export function LedNames() {
    return ["Led 1-RED", "Led 2-GREEN", "Led 3-BLUE"]; // Define names for LEDs in the device
}

export function LedPositions() {
    return ledPositions; // Return defined positions for LEDs in the layout
}

export function Render() {
    const now = Date.now();
    if (now - lastRenderTime < (1000 / frameRate)) return;
    lastRenderTime = now;

    if (!running) return;

    try {
        const rgbwData = getSignalRGBData();
        sendToSACN(rgbwData);
    } catch (err) {
        console.error("Error in Render function:", err);
    }
}

export function Shutdown() {
    running = false;
    sacnSenders.forEach(sender => sender.close());
    console.log("SignalRGB to sACN plugin stopped.");
}

export function Validate(endpoint) {
    const supportedDevices = [
        { vendor_id: 1234, product_id: 5678 },
    ];

    return supportedDevices.some(device => device.vendor_id === endpoint.vendor_id && device.product_id === endpoint.product_id);
}

export function ImageUrl() {
    return "https://www.qlcplus.org/forum/ext/planetstyles/flightdeck/store/final-logo-dark-white-plus4.svg"; // Replace with actual hosted image URL
}

export function BrightnessController() {
    return {
        min: 0,
        max: 255,
        default: 128,
    };
}

function sendToSACN(rgbwData) {
    const dmxDataPerUniverse = Array.from({ length: universeCount }, () => new Uint8Array(512));

    rgbwData.forEach((rgbw, index) => {
        const universeIndex = Math.floor(index / fixturesPerUniverse);
        if (universeIndex < universeCount) {
            const channelIndex = (index % fixturesPerUniverse) * 4;
            const dmxData = dmxDataPerUniverse[universeIndex];
            dmxData[channelIndex] = rgbw.r;
            dmxData[channelIndex + 1] = rgbw.g;
            dmxData[channelIndex + 2] = rgbw.b;
            dmxData[channelIndex + 3] = rgbw.w;
        }
    });

    dmxDataPerUniverse.forEach((dmxData, universeIndex) => {
        try {
            sacnSenders[universeIndex].send(dmxData);
        } catch (err) {
            console.error(`Error sending DMX data to Universe ${universeIndex + 1}:`, err);
        }
    });
}

function getSignalRGBData() {
    try {
        // Retrieve pixel data from the Python script using the 'child_process' module
        const result = execFileSync('python', ['signalrgb_integration.py', 'get_pixel_data']);
        const output = result.toString().trim();
        
        // Log the output for debugging
        console.log('Python script output:', output);

        if (!output) {
            throw new Error('No output received from Python script');
        }

        const parsedOutput = JSON.parse(output);
        
        // Return empty array if parsedOutput is not an array
        if (!Array.isArray(parsedOutput)) {
            throw new Error('Invalid JSON structure received from Python script');
        }

        return parsedOutput;
    } catch (err) {
        console.error('Error retrieving pixel data:', err);
        return [];
    }
}

// Export default object containing all functions
export default {
    Name,
    VendorId,
    ProductId,
    Publisher,
    Documentation,
    Size,
    ControllableParameters,
    DeviceMapping,
    Initialize,
    LedNames,
    LedPositions,
    Render,
    Shutdown,
    Validate,
    ImageUrl,
    BrightnessController
};

import { execFile } from 'child_process';
import plugin from './signalRGB.mjs'; // Ensure the path and file name are correct

// Function to call Python script
function callPythonScript(action, args = []) {
    return new Promise((resolve, reject) => {
        execFile('python', ['signalrgb_integration.py', action, ...args], (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
            } else if (stderr) {
                reject(`Stderr: ${stderr}`);
            } else {
                resolve(JSON.parse(stdout));
            }
        });
    });
}

// Initialize the plugin
plugin.Initialize();

// Simulate rendering
setInterval(() => {
    plugin.Render();
}, 1000 / plugin.frameRate);

// Stop the plugin after a certain duration (e.g., 10 seconds)
setTimeout(async () => {
    plugin.Shutdown();
    console.log("SignalRGB to sACN plugin stopped.");

    try {
        const currentEffect = await callPythonScript('get_current_effect');
        console.log('Current Effect:', currentEffect.effect);

        const setBrightnessResult = await callPythonScript('set_brightness', ['50']);
        console.log(setBrightnessResult.result);

        const applyEffectResult = await callPythonScript('apply_effect', ['Neon Shift']);
        console.log(applyEffectResult.result);
    } catch (error) {
        console.error(error);
    }
}, 10000);

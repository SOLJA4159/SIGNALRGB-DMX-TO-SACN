from signalrgb.client import SignalRGBClient

# Initialize the client
client = SignalRGBClient(host="127.0.0.1", port=16038)

# List all effects
effects = client.get_effects()
for effect in effects:
    print(f"Effect: {effect.attributes.name}")

# Apply an effect
client.apply_effect_by_name("Neon Shift")

# Control brightness
client.brightness = 50
print(f"Current brightness: {client.brightness}")

# Enable/disable the canvas
client.enabled = True
print(f"Canvas enabled: {client.enabled}")

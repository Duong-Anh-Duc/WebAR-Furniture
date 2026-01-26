#!/usr/bin/env python3
"""
Convert GLB to USDZ using Blender
Usage: blender -b --factory-startup --python glb_to_usdz.py -- input.glb output.usdz
"""

import bpy
import sys
import os

# Parse arguments after --
argv = sys.argv
argv = argv[argv.index("--") + 1:]

if len(argv) < 2:
    print("ERROR: Require input.glb and output.usdz")
    sys.exit(1)

input_glb = argv[0]
output_usdz = argv[1]

print(f"Converting {input_glb} -> {output_usdz}")

# Verify input exists
if not os.path.exists(input_glb):
    print(f"ERROR: Input file not found: {input_glb}")
    sys.exit(1)

# Reset Blender scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# Import GLB
try:
    bpy.ops.import_scene.gltf(filepath=input_glb)
    print(f"OK: Imported {input_glb}")
except Exception as e:
    print(f"ERROR: Failed to import GLB: {e}")
    sys.exit(1)

# Ensure output directory exists
os.makedirs(os.path.dirname(output_usdz), exist_ok=True)

# Export as USDZ (USD format)
try:
    # Blender 5.0 - with material support
    bpy.ops.wm.usd_export(
        filepath=output_usdz,
        selected_objects_only=False,
        export_materials=True  # Support materials/textures
    )
    print(f"OK: Exported {output_usdz} (with materials)")
except Exception as e:
    print(f"ERROR: Failed to export USDZ: {e}")
    sys.exit(1)

# Verify output
if os.path.exists(output_usdz):
    file_size = os.path.getsize(output_usdz)
    print(f"SUCCESS: {output_usdz} ({file_size} bytes)")
    sys.exit(0)
else:
    print(f"ERROR: Output file not created: {output_usdz}")
    sys.exit(1)

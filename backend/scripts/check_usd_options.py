#!/usr/bin/env python3
"""Check Blender USD export options"""
import bpy

print("=" * 70)
print("BLENDER 5.0 USD EXPORT OPTIONS")
print("=" * 70)

# Get USD export operator
try:
    # Call it to get properties
    import rna_prop_ui
    
    # Check operator class
    op_class = bpy.ops.wm.usd_export
    print(f"\nOperator: {op_class}")
    print(f"Help: {op_class.__doc__}")
    
except Exception as e:
    print(f"Error checking operator: {e}")

# List all available export options by trying common ones
print("\n" + "=" * 70)
print("COMMON USDZ EXPORT OPTIONS (test if supported):")
print("=" * 70)

common_options = [
    'filepath',
    'selected_objects_only',
    'export_textures',
    'export_materials',
    'export_hair',
    'export_deformation',
    'export_blend_shapes',
    'export_normals',
    'export_uv',
    'export_smooth_groups',
    'export_animation',
    'stage_scale',
    'up_axis',
]

for opt in common_options:
    print(f"  - {opt}")

print("\n" + "=" * 70)

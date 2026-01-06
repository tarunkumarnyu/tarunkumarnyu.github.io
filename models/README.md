# 3D Model Files - Required Format

Place your CAD model files in this folder in **GLB format**.

## Required Files

| Filename | Project |
|----------|---------|
| `uav_ugv.glb` | Reconfigurable UAV+UGV |
| `phoenix.glb` | Phoenix High Altitude Drone |
| `osprey.glb` | Osprey Robot with Gripper |
| `s900.glb` | S900 V2 Quadcopter |
| `zeus.glb` | Zeus Competition Drone |
| `rov.glb` | Remotely Operated Vehicle |
| `spiderbot.glb` | Spiderbot Walking Robot |
| `smartclean.glb` | Smart Clean Robot |

## How to Convert Your SolidWorks Models

### Option 1: Using Blender (Free)
1. Export from SolidWorks as `.stl` or `.obj`
2. Open Blender → File → Import → STL/OBJ
3. File → Export → glTF 2.0 (.glb)

### Option 2: Online Converter
1. Export from SolidWorks as `.stl`
2. Go to: https://imagetostl.com/convert/file/stl/to/glb
3. Upload and convert
4. Download the `.glb` file

### Option 3: CAD Exchanger
1. Download CAD Exchanger: https://cadexchanger.com/
2. Import your SLDPRT/SLDASM file
3. Export as GLB

## File Size Recommendations
- Keep each model under **5MB** for fast loading
- Reduce polygon count if needed for web performance
- Models will auto-rotate and be interactive

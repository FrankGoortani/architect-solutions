# Architect Solutions Voxel Logo Generator

This tool generates a 3D voxel brick-style logo for Architect Solutions with a unique dual-projection property: a solid 3D structure with different letters carved into it, visible when viewed from different perpendicular faces.

## Carved Dual Projection Concept

The core concept behind this logo is a 3D voxel structure (6x6x8) that displays two different letter projections when viewed from different angles:
- When viewed from the left side, it shows an "S" carved into the structure as negative space
- When viewed from the right side (perpendicular to the S view), it shows an "A" carved into the structure as negative space
- Both letters are visible from an isometric top view as partially carved shapes

This creates a visually interesting logo with hidden complexity that represents the innovative approach of Architect Solutions.

## Visual Style

- The voxels have soft/rounded corners for a more polished appearance
- The structure uses a brick color (reddish-brown) for the voxels
- The overall object is filled/solid with the S and A letters carved into it (negative space), rather than building the letters from individual bricks

## How It Works

The algorithm works through several key steps:

1. **Start with a Solid Block**: Unlike the original approach, we begin with a completely filled 6x6x8 voxel array.
2. **Pattern Definition**: Both the "S" and "A" patterns are defined as 2D boolean arrays.
3. **Strategic Carving**: Voxels are selectively removed (carved out) from the solid block:
   - The "S" pattern is carved into the left face (x=0 plane)
   - The "A" pattern is carved into the right face (y=0 plane)
   - Where the pattern indicates an empty space, we remove the corresponding voxel
4. **Projection Verification**: The algorithm checks if the current voxel configuration correctly projects both letters.
5. **Projection Fixing**: If needed, additional voxels are strategically added or removed to ensure the projections match exactly.

The challenge is finding a 3D voxel arrangement that correctly displays both patterns simultaneously as carved negative space.

## Logo Specifications

- **Dimensions**: 6x6x8 (width x depth x height)
- **Projections**:
  - Left face (x=0 plane): "S" letter carved as negative space
  - Right face (y=0 plane): "A" letter carved as negative space
  - Isometric top view: Both letters partially visible
- **Style**:
  - Brick-colored voxels (reddish-brown)
  - Soft/rounded corners
  - Solid structure with carved letters
- **Format**: Available as Python object, coordinate list, and 3D OBJ model with rounded corners

## Usage

1. Run the script:
   ```
   python architect_solutions_logo_generator.py
   ```

2. The script will:
   - Generate the 3D voxel structure
   - Verify both projections match the desired patterns
   - Export the result in multiple formats
   - Display information about the model

3. To visualize the 3D model:
   - Uncomment the `visualize_voxels(voxel_space)` line in the main function
   - Import the generated OBJ file into 3D software like Blender
   - Open the voxel_logo_viewer.html file in a web browser

## Output Files

The script generates several files:
- `architect_solutions_logo.npy`: NumPy binary file for Python reuse
- `architect_solutions_logo_coords.txt`: Simple text list of filled voxel coordinates
- `architect_solutions_logo.obj`: 3D model file with rounded corners, compatible with most 3D software

## Requirements

- Python 3.x
- NumPy
- Matplotlib

## Interactive Voxel Editor

The enhanced `voxel_logo_viewer.html` file now provides an interactive 3D editor that allows you to:

- **Add new voxels**: Left-click on any face of an existing voxel to add a new voxel adjacent to it
- **Remove voxels**: Right-click on any voxel to remove it from the structure
- **Visual feedback**: A semi-transparent red cube shows where a new voxel will be placed
- **Save your work**: Click the "Save Model" button to download the current voxel data as a JSON file

The editor maintains the visual style of the original logo, with brick-colored voxels and soft/rounded corners for all added blocks.

### Editing Controls

- **Left-click + drag**: Rotate the model
- **Right-click + drag**: Pan the camera
- **Scroll**: Zoom in/out
- **Left-click on a face**: Add a new voxel adjacent to the clicked face
- **Right-click on a voxel**: Remove the clicked voxel
- **View buttons**: Quickly switch to predefined views (S side, A side, or isometric)
- **Save button**: Download the current voxel data as a JSON file

### Saving Your Work

When you click the "Save Model" button, the editor will generate a JSON file containing the current state of the voxel model. This file can be:

1. Used as a reference for updating the patterns in the Python generator script
2. Loaded back into the editor (by modifying the voxel data in the HTML file)
3. Imported into other applications that can parse JSON data

## Web Viewer

The included `voxel_logo_viewer.html` file provides an interactive 3D viewer and editor that lets you:
- View the logo from an isometric top view where both carved letters are partially visible
- Rotate to see each letter clearly with dedicated view buttons
- Interact with the 3D model using mouse controls
- See the brick-colored voxels with soft/rounded corners
- Add and remove voxels to customize the logo
- Save your customized logo as a JSON data file

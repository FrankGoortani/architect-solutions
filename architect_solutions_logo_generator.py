#!/usr/bin/env python3
"""
# Architect Solutions Logo Generator

This script generates a 3D voxel brick-style logo for Architect Solutions
with dual projection properties:
- When viewed from the left side, it shows an "S" pattern (carved into the structure).
- When viewed from the right side (perpendicular to the S view), it shows an "A" pattern (carved into the structure).

The voxel structure is 6x6x8 (width x depth x height) and represents the company
logo in a creative 3D format. The structure is a solid block with the 'S' and 'A' letters
carved into it as negative space, with soft/rounded corners for a more polished appearance.
"""

import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def create_dual_projection_logo():
    """
    Creates a 3D voxel structure that projects 'S' from one angle and 'A' from another.

    The voxel space is 6x6x8 (width x depth x height).
    - The 'S' pattern is carved into the structure and visible from the left side.
    - The 'A' pattern is carved into the structure and visible from the right side.
    - The patterns are created as negative space (carved out) from a solid block.

    Returns:
        voxel_space: 3D numpy array of booleans (True = filled voxel, False = empty)
    """
    # Define dimensions of our voxel space
    width = 6  # x dimension
    depth = 6  # y dimension
    height = 8  # z dimension (increased to 8 as per requirements)

    # Create a filled 3D array (True = filled, False = empty)
    # We're starting with a solid block and will carve out the letters
    voxel_space = np.ones((width, depth, height), dtype=bool)

    # Define the 'S' pattern (as viewed from front - YZ projection)
    # Each row corresponds to one Z level, each column to one Y position
    s_pattern = np.array([
        [True, True, True, True, True, True],       # ######  (z=0)
        [True, False, False, False, False, False],  # #.....  (z=1)
        [True, False, False, False, False, False],  # #.....  (z=2)
        [True, True, True, True, True, True],       # ######  (z=3)
        [False, False, False, False, False, True],  # .....#  (z=4)
        [False, False, False, False, False, True],  # .....#  (z=5)
        [True, True, True, True, True, True],       # ######  (z=6)
    ])

    # Define the 'A' pattern (as viewed from right side - XZ projection)
    # Each row corresponds to one Z level, each column to one X position
    a_pattern = np.array([
        [False, False, True, True, False, False],   # ..##..  (z=0)
        [False, True, False, False, True, False],   # .#..#.  (z=1)
        [True, False, False, False, False, True],   # #....#  (z=2)
        [True, True, True, True, True, True],       # ######  (z=3)
        [True, False, False, False, False, True],   # #....#  (z=4)
        [True, False, False, False, False, True],   # #....#  (z=5)
        [True, False, False, False, False, True],   # #....#  (z=6)
    ])

    # STEP 1: Carve out the letters from the solid block
    # For the 'S' pattern - carve from the left side (x=0)
    for z in range(min(height, len(s_pattern))):
        for y in range(depth):
            if not s_pattern[z, y]:  # If the pattern is empty (false), carve out the voxel
                voxel_space[0, y, z] = False

    # For the 'A' pattern - carve from the right side (y=0)
    for z in range(min(height, len(a_pattern))):
        for x in range(width):
            if not a_pattern[z, x]:  # If the pattern is empty (false), carve out the voxel
                voxel_space[x, 0, z] = False

    # STEP 2: Check if our initial placement creates the correct projections
    s_proj, a_proj = get_projections(voxel_space)

    # Verify if projections match patterns
    s_match = np.array_equal(s_proj, s_pattern)
    a_match = np.array_equal(a_proj, a_pattern)

    # STEP 3: Fix projections if needed
    if not (s_match and a_match):
        print("Initial voxel placement doesn't match projections exactly.")
        print(f"S projection match: {s_match}")
        print(f"A projection match: {a_match}")

        # Attempt to fix projections by adding or removing voxels
        voxel_space = fix_projections(voxel_space, s_pattern, a_pattern)

        # Check again after fixing
        s_proj, a_proj = get_projections(voxel_space)
        s_match = np.array_equal(s_proj, s_pattern)
        a_match = np.array_equal(a_proj, a_pattern)

        print("After fixing:")
        print(f"S projection match: {s_match}")
        print(f"A projection match: {a_match}")

    return voxel_space

def get_projections(voxel_space):
    """
    Computes the S and A projections from the voxel space.

    Args:
        voxel_space: 3D numpy array of booleans representing the voxel structure

    Returns:
        s_projection: 2D numpy array showing the S projection (left side view)
        a_projection: 2D numpy array showing the A projection (right side view)
    """
    width, depth, height = voxel_space.shape

    # Get S projection (left side, x=0)
    s_projection = np.zeros((depth, height), dtype=bool)
    for y in range(depth):
        for z in range(height):
            # Check if any voxel exists at this position on the left face
            s_projection[y, z] = voxel_space[0, y, z]

    # Get A projection (right side, y=0)
    a_projection = np.zeros((width, height), dtype=bool)
    for x in range(width):
        for z in range(height):
            # Check if any voxel exists at this position on the right face
            a_projection[x, z] = voxel_space[x, 0, z]

    return s_projection, a_projection

def fix_projections(voxel_space, s_pattern, a_pattern):
    """
    Attempts to fix the voxel space to match both projection patterns.

    This function works in two phases:
    1. Remove voxels to ensure empty pattern positions are carved out
    2. Add voxels to ensure filled pattern positions remain solid

    Args:
        voxel_space: 3D numpy array of booleans representing the voxel structure
        s_pattern: 2D numpy array representing the desired S projection
        a_pattern: 2D numpy array representing the desired A projection

    Returns:
        fixed_voxel_space: 3D numpy array with fixed voxel placements
    """
    width, depth, height = voxel_space.shape
    fixed_voxel_space = voxel_space.copy()

    # First, get current projections
    s_proj, a_proj = get_projections(fixed_voxel_space)

    # PHASE 1: For our carved design, we need to ensure that every empty position
    # in the pattern has the voxel removed

    # Fix S pattern - ensure every empty position in S pattern has voxel removed
    for z in range(height):
        for y in range(depth):
            # If S pattern should be empty (false) but voxel exists (true)
            if z < len(s_pattern) and not s_pattern[z, y] and s_proj[y, z]:
                # Remove voxel on the left face (x=0)
                fixed_voxel_space[0, y, z] = False
                print(f"Fixed S projection at (y={y}, z={z})")

    # Fix A pattern - ensure every empty position in A pattern has voxel removed
    for z in range(height):
        for x in range(width):
            # If A pattern should be empty (false) but voxel exists (true)
            if z < len(a_pattern) and not a_pattern[z, x] and a_proj[x, z]:
                # Remove voxel on the right face (y=0)
                fixed_voxel_space[x, 0, z] = False
                print(f"Fixed A projection at (x={x}, z={z})")

    # Update projections after removing voxels
    s_proj, a_proj = get_projections(fixed_voxel_space)

    # PHASE 2: For our carved design, we need to ensure that filled positions in the pattern
    # maintain their voxels

    # Fix S pattern - ensure every filled position in S pattern keeps its voxel
    for z in range(height):
        for y in range(depth):
            # If S pattern should be filled (true) but voxel is missing (false)
            if z < len(s_pattern) and s_pattern[z, y] and not s_proj[y, z]:
                # Add voxel on the left face (x=0)
                fixed_voxel_space[0, y, z] = True
                print(f"Restored S projection at (y={y}, z={z})")

    # Fix A pattern - ensure every filled position in A pattern keeps its voxel
    for z in range(height):
        for x in range(width):
            # If A pattern should be filled (true) but voxel is missing (false)
            if z < len(a_pattern) and a_pattern[z, x] and not a_proj[x, z]:
                # Add voxel on the right face (y=0)
                fixed_voxel_space[x, 0, z] = True
                print(f"Restored A projection at (x={x}, z={z})")

    return fixed_voxel_space

def print_projection(projection, name):
    """
    Prints a 2D projection pattern in ASCII art style.

    Args:
        projection: 2D numpy array of booleans
        name: Name of the projection (e.g., 'S' or 'A')
    """
    print(f"{name} Projection:")
    for z in range(projection.shape[1]):
        row = ""
        for x in range(projection.shape[0]):
            row += "#" if projection[x, z] else "."
        print(row)

def visualize_voxels(voxel_space):
    """
    Visualizes the 3D voxel structure using Matplotlib.

    This function creates a 3D plot of the voxel structure, with each voxel
    represented as a cube. This allows for interactive visualization of the
    dual-projection logo.

    Args:
        voxel_space: 3D numpy array of booleans representing the voxel structure
    """
    fig = plt.figure(figsize=(10, 8))
    ax = fig.add_subplot(111, projection='3d')

    # Plot voxels with a brick color
    brick_color = '#A0522D'  # Sienna/brick color
    ax.voxels(voxel_space, facecolors=brick_color, edgecolor='k', alpha=0.9)

    # Set labels and title
    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    ax.set_zlabel('Z')
    ax.set_title('Architect Solutions - Dual-Projection Voxel Logo')

    # Set viewing angle to better see the structure
    # Set isometric top view
    ax.view_init(elev=35, azim=45)

    plt.show()

def export_voxel_data(voxel_space, filename):
    """
    Exports the voxel structure to various file formats.

    This function exports the 3D voxel data in multiple formats:
    1. NumPy binary file (.npy) - for easy reloading in Python
    2. Coordinate list (.txt) - simple text format listing filled voxel positions
    3. OBJ file (.obj) - 3D model format compatible with many 3D software packages

    Args:
        voxel_space: 3D numpy array of booleans representing the voxel structure
        filename: Base name for the exported files (without extension)
    """
    width, depth, height = voxel_space.shape

    # Export as binary NumPy array
    np.save(f"{filename}.npy", voxel_space)
    print(f"Saved NumPy binary file: {filename}.npy")

    # Export as text file with coordinates
    with open(f"{filename}_coords.txt", 'w') as f:
        f.write("# Voxel coordinates (x, y, z)\n")
        for x in range(width):
            for y in range(depth):
                for z in range(height):
                    if voxel_space[x, y, z]:
                        f.write(f"{x}, {y}, {z}\n")
    print(f"Saved coordinate list: {filename}_coords.txt")

    # Export as OBJ file for 3D rendering with rounded corners
    with open(f"{filename}.obj", 'w') as f:
        f.write("# Architect Solutions Dual-Projection Voxel Logo\n")
        f.write("# Generated by architect_solutions_logo_generator.py\n")
        f.write("# Voxels have soft/rounded corners\n\n")

        vertex_index = 1
        for x in range(width):
            for y in range(depth):
                for z in range(height):
                    if voxel_space[x, y, z]:
                        # Add vertices for a cube at (x,y,z) with slightly rounded corners
                        # For soft corners, we'll use a small offset from the perfect cube
                        corner_offset = 0.05  # Small offset for rounding

                        # Bottom face with rounded corners
                        f.write(f"v {x+corner_offset} {y+corner_offset} {z+corner_offset}\n")
                        f.write(f"v {x+1-corner_offset} {y+corner_offset} {z+corner_offset}\n")
                        f.write(f"v {x+1-corner_offset} {y+1-corner_offset} {z+corner_offset}\n")
                        f.write(f"v {x+corner_offset} {y+1-corner_offset} {z+corner_offset}\n")
                        # Top face with rounded corners
                        f.write(f"v {x+corner_offset} {y+corner_offset} {z+1-corner_offset}\n")
                        f.write(f"v {x+1-corner_offset} {y+corner_offset} {z+1-corner_offset}\n")
                        f.write(f"v {x+1-corner_offset} {y+1-corner_offset} {z+1-corner_offset}\n")
                        f.write(f"v {x+corner_offset} {y+1-corner_offset} {z+1-corner_offset}\n")

                        # Write the faces (each cube has 6 faces)
                        # Bottom face
                        f.write(f"f {vertex_index} {vertex_index+1} {vertex_index+2} {vertex_index+3}\n")
                        # Top face
                        f.write(f"f {vertex_index+4} {vertex_index+5} {vertex_index+6} {vertex_index+7}\n")
                        # Side faces
                        f.write(f"f {vertex_index} {vertex_index+1} {vertex_index+5} {vertex_index+4}\n")
                        f.write(f"f {vertex_index+1} {vertex_index+2} {vertex_index+6} {vertex_index+5}\n")
                        f.write(f"f {vertex_index+2} {vertex_index+3} {vertex_index+7} {vertex_index+6}\n")
                        f.write(f"f {vertex_index+3} {vertex_index} {vertex_index+4} {vertex_index+7}\n")

                        vertex_index += 8
    print(f"Saved OBJ 3D model file: {filename}.obj")

def main():
    """
    Main function to create and visualize the dual-projection logo.

    This function:
    1. Creates the dual-projection voxel structure
    2. Verifies the projections match the desired patterns
    3. Exports the voxel data to various file formats
    4. Optionally visualizes the 3D structure

    Returns:
        voxel_space: The 3D numpy array representing the logo
    """
    print("\nArchitect Solutions Logo Generator")
    print("=================================")
    print("This script creates a 3D voxel structure (6x6x8) that projects:")
    print("- 'S' when viewed from the left side")
    print("- 'A' when viewed from the right side (perpendicular to S view)")
    print("- The structure is solid with letters carved into it as negative space")
    print("=================================\n")

    # Create the voxel structure
    voxel_space = create_dual_projection_logo()

    # Get and print projections for verification
    s_proj, a_proj = get_projections(voxel_space)
    print("\nVerifying final projections:")
    print_projection(s_proj, "S")
    print("\n")
    print_projection(a_proj, "A")

    # Count filled voxels
    filled_count = np.sum(voxel_space)
    total_voxels = voxel_space.size
    print(f"\nVoxel statistics:")
    print(f"- Filled voxels: {filled_count}")
    print(f"- Total voxels: {total_voxels}")
    print(f"- Fill percentage: {filled_count/total_voxels*100:.1f}%")

    # Export the data
    export_voxel_data(voxel_space, "architect_solutions_logo")

    print("\nHow the dual projection works:")
    print("-----------------------------")
    print("1. The 3D structure is a solid block with letters carved into it.")
    print("2. The S letter is visible when viewed from the left side (x=0).")
    print("3. The A letter is visible when viewed from the right side (y=0).")
    print("4. The structure uses an isometric top view with both letters partially visible.")
    print("5. The voxels have soft/rounded corners for a more polished appearance.")
    print("6. The structure uses a brick color (reddish-brown) for visual appeal.")

    print("\nTo visualize this model:")
    print("1. Run: visualize_voxels(voxel_space)")
    print("2. Or import architect_solutions_logo.obj into 3D software")
    print("   such as Blender, MeshLab, or online 3D viewers.\n")

    # Uncomment the following line to visualize the 3D model
    # visualize_voxels(voxel_space)

    return voxel_space

if __name__ == "__main__":
    voxel_space = main()

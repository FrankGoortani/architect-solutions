# Architect Solutions Repository Guidelines

This repository contains the source for the **Architect Solutions** landing page and supporting logo generation script.

## Folder Layout
- `index.html` and related assets under `assets/` make up the static website.
- `architect_solutions_logo_generator.py` produces a voxel-based logo. It relies on `numpy` and `matplotlib`.

## Style Guide
- **HTML/CSS/JavaScript** files use two-space indentation.
- **Python** code uses four-space indentation and should remain PEP8 compliant where practical.
- Keep line lengths under 100 characters.

## Contributing
1. Install the Python dependencies if you want to run the logo generator:
   ```bash
   pip install numpy matplotlib
   ```
2. Run the generator with `python3 architect_solutions_logo_generator.py` to ensure the script still works.
3. For website changes, open `index.html` in a browser to verify layout and functionality.
4. No automated test suite is available yet; manual validation is required.

## Commit Messages
- Use concise commit summaries (under 72 characters) followed by a blank line and more detail if necessary.

## Pull Requests
- Describe what was changed and why.
- Mention any manual validation performed (e.g., ran the Python script, viewed the page locally).

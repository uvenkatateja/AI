# Shirts & Pants Designer with Three.js

This feature allows users to design and customize clothing items in 3D using Three.js.

## Features

- **3D Interactive Design**: Manipulate and view clothing items in 3D
- **Multiple Clothing Types**: Choose between T-shirts, Hoodies, and Pants
- **Color Customization**: Select from a range of colors for your clothing
- **Logo Addition**: Upload or provide a URL to add logos to your clothing
- **Text Customization**: Add custom text with adjustable colors
- **Design Saving**: Save your designs for future reference

## How to Use

1. Navigate to the "Shirts & Pants Designer" in the dashboard
2. Select a clothing item type (T-shirt, Hoodie, or Pants)
3. Choose a base color for your item
4. Add logos by providing a URL or uploading an image
5. Add custom text and select text color
6. Interact with the 3D model:
   - Drag to rotate
   - Scroll to zoom
   - Press shift and drag to pan
7. Click "Save Design" to store your creation

## Implementation Details

The clothing designer is built using:

- **Three.js**: For 3D rendering and interaction
- **Canvas API**: For texture creation and manipulation
- **React State**: For managing design options and user interactions

### Key Components

1. **ClothingDesigner.tsx**: Main component that handles the UI and 3D rendering
2. **Three.js Setup**: Creates the 3D scene, camera, and renderer
3. **Canvas Texturing**: Uses HTML Canvas to create dynamic textures for the 3D models
4. **OrbitControls**: Provides intuitive ways to manipulate the 3D view

## Future Enhancements

- More detailed 3D models with proper clothing physics
- Additional customization options (patterns, materials, etc.)
- AR visualization to see designs on your body
- Social sharing capabilities
- Integration with e-commerce to order custom designs

## Dependencies

- Three.js
- React
- Tailwind CSS 
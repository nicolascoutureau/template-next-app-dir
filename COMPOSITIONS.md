# Auto-Import Compositions System

This project implements an auto-import system for Remotion compositions that allows you to easily add new compositions and have them automatically available in both the Remotion Studio and the web player.

## How It Works

### 1. Composition Structure

All compositions are defined in the `src/remotion/compositions.ts` file. Each composition has metadata including:

- `id`: Unique identifier for the composition
- `component`: The React component to render
- `durationInFrames`: Video duration in frames
- `fps`: Frames per second
- `width` & `height`: Video dimensions
- `defaultProps`: Optional default props for the component

### 2. Adding New Compositions

To add a new composition:

1. **Create your composition component** in `src/remotion/`:

   ```tsx
   // src/remotion/MyNewComposition.tsx
   import { AbsoluteFill } from "remotion";

   export const MyNewComposition: React.FC = () => {
     return (
       <AbsoluteFill className="flex items-center justify-center bg-blue-500">
         <h1 className="text-white text-4xl">My New Composition</h1>
       </AbsoluteFill>
     );
   };
   ```

2. **Add it to the compositions array** in `src/remotion/compositions.ts`:

   ```tsx
   import { MyNewComposition } from "./MyNewComposition";

   export const compositions: CompositionMeta[] = [
     // ... existing compositions
     {
       id: "MyNewComposition",
       component: MyNewComposition,
       durationInFrames: 120,
       fps: 30,
       width: 1920,
       height: 1080,
     },
   ];
   ```

3. **That's it!** The composition will automatically be:
   - Available in the Remotion Studio
   - Available in the web player dropdown
   - Available for rendering via Lambda

### 3. Compositions with Props

For compositions that accept props, you can define default values:

```tsx
// src/remotion/CustomizableText.tsx
interface CustomizableTextProps {
  text: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
}

export const CustomizableText: React.FC<CustomizableTextProps> = ({
  text = "Default Text",
  backgroundColor = "#1f2937",
  textColor = "#ffffff",
  fontSize = 64,
}) => {
  // ... component implementation
};
```

Then in `compositions.ts`:

```tsx
{
  id: "CustomizableText",
  component: CustomizableText,
  durationInFrames: 120,
  fps: 30,
  width: 1920,
  height: 1080,
  defaultProps: {
    text: "Hello from CustomizableText!",
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    fontSize: 72,
  },
}
```

### 4. Using Compositions

#### In the Web Player

The main page (`src/app/page.tsx`) automatically provides:

- A dropdown to select compositions
- A dynamic player that renders the selected composition
- Custom controls for compositions that support them
- Render controls for Lambda rendering

#### In Remotion Studio

All compositions are automatically registered and available in the Remotion Studio interface.

#### Programmatically

```tsx
import {
  getCompositionById,
  getCompositionIds,
} from "../remotion/compositions";

// Get all available composition IDs
const ids = getCompositionIds(); // ["HelloWorld", "SimpleText", "CustomizableText"]

// Get a specific composition
const composition = getCompositionById("HelloWorld");
```

### 5. Benefits

- **No manual registration**: Just add to the array and it's available everywhere
- **Type safety**: TypeScript ensures composition metadata is correct
- **Default props**: Easy to provide sensible defaults for compositions
- **Dynamic controls**: Automatic UI for customizing composition props
- **Consistent interface**: All compositions follow the same pattern

### 6. File Structure

```
src/remotion/
├── compositions.ts          # Auto-import configuration
├── Root.tsx               # Auto-registers all compositions
├── HelloWorld.tsx         # Example composition
├── SimpleText.tsx         # Example composition
├── CustomizableText.tsx   # Example composition with props
└── base/                  # Shared components and hooks
    ├── components/
    └── hooks/
```

This system makes it easy to add new compositions without touching multiple files or worrying about registration. Just create your component and add it to the array!

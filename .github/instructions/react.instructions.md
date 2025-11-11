# React Development Instructions

Path-specific instructions for React components and features.

## React Best Practices

- Use functional components with hooks
- Follow React naming conventions (PascalCase for components)
- Keep components small and reusable
- Use proper prop types or TypeScript interfaces

## Component Structure

```jsx
import React from 'react';

// Props interface (if using TypeScript)
interface ComponentProps {
  // prop definitions
}

// Component definition
const ComponentName: React.FC<ComponentProps> = ({ props }) => {
  // hooks
  // handlers
  // render
  return (
    // JSX
  );
};

export default ComponentName;
```

## State Management

- Use useState for local state
- Use useContext for shared state
- Consider Redux or Zustand for complex state management

## Performance

- Use React.memo for expensive components
- Use useMemo and useCallback appropriately
- Avoid unnecessary re-renders

## Testing

- Write tests using React Testing Library
- Test component behavior, not implementation details
- Ensure accessibility in tests

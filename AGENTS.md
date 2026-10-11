# AGENTS.md — `@codexporer.io/expo-portal`

## Package Overview
Lightweight portal system for React Native, allowing nested components (dialogs, tooltips, action sheets, floating action buttons) to render into an elevated host location at the root of the view hierarchy.

## Key Exports
- `PortalHost`: Target rendering container mounted at the root of the app.
- `Portal`: Teleportation component rendering its children into the enclosing `PortalHost`.

## Critical Guidelines for AI Agents
- **Root Mount**: Ensure `<PortalHost>` is mounted at the top level of the component tree, wrapping the main app navigator.
- **Escape Stacking Contexts**: Wrap any component that needs to break out of parent overflow: hidden, clipping, or z-index constraints (like `<Dialog />` or toast overlays) in `<Portal>`.
- **Clean Unmounting**: Unmounting `<Portal>` automatically removes teleported children from the `<PortalHost>` without ghost artifacts.

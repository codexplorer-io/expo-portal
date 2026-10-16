# AGENTS.md — `@codexporer.io/expo-portal`

## Package Overview
Lightweight, singleton-driven portal solution for React Native and Expo applications. Allows deeply nested components (dialogs, tooltips, action sheets, floating overlays) to teleport their UI to an elevated, top-level `<PortalHost />` container without clipping from ancestor `overflow: hidden`, fixed dimensions, or z-index constraints.

## Peer Dependencies
```json
{
  "react": "*",
  "react-native": "*"
}
```

## TypeScript Contracts (`src/index.tsx`)

```typescript
export interface PortalHostProps {
  name?: string;
  style?: StyleProp<ViewStyle>;
}

export interface PortalProps {
  hostName?: string;
  children: React.ReactNode;
}
```

## Key Exports
- `PortalHost`: Outlet container that renders teleported portal elements. Renders as a full-screen overlay `<View style={[StyleSheet.absoluteFill, style]} pointerEvents="box-none" collapsable={false}>`.
  - **IMPORTANT**: `<PortalHost />` is a self-closing component and does **NOT** accept or render `children`. Do **NOT** wrap application navigators or components inside `<PortalHost>`.
- `Portal`: Headless teleportation component. Uses React `useId()` and a singleton `PortalManager` to mount, update, and unmount `children` into the designated `hostName` (defaults to `'root'`). Returns `null`.

## Critical Guidelines for AI Agents
- **Sibling Mount, NOT a Wrapper**: Always mount `<PortalHost />` as a self-closing sibling next to your root navigation container (e.g. inside `SafeAreaProvider` / `AppThemeProvider`), typically alongside global dialogs:
  ```tsx
  <SafeAreaProvider>
    <AppNavigator />
    <MessageDialog />
    <PortalHost />
  </SafeAreaProvider>
  ```
- **Default Host**: When `name` / `hostName` are omitted, both `<PortalHost />` and `<Portal />` default to `'root'`.
- **Named Hosts**: For multi-layer architectures, use `name="hostName"` on `<PortalHost />` and `hostName="hostName"` on `<Portal />`.
- **Touch Event Transparency**: `<PortalHost />` container has `pointerEvents="box-none"`, allowing underlying screens to receive touches where no portaled content is drawn.
- **Clean Lifecycle**: Unmounting `<Portal />` automatically removes its portaled node from the active host map and notifies subscribers without memory leaks or ghost artifacts.


---
name: expo-portal
description: Instructions and guidelines for using @codexporer.io/expo-portal (Expo Portal) in React Native and Expo applications.
---

# `@codexporer.io/expo-portal` Skill

## Overview
`@codexporer.io/expo-portal` teleports React components from deeply nested children into a top-level `<PortalHost />` outlet view via an in-memory pub-sub `PortalManager`. This prevents UI clipping caused by ancestor `overflow: hidden`, fixed dimensions, or complex z-indexing constraints.

---

## Peer Dependencies
```json
{
  "react": "*",
  "react-native": "*"
}
```

---

## When to Use
- Rendering modals, dialogs, full-screen loaders, tooltips, or floating action menus from deep within the component tree.
- Preventing scroll containers or masked card views from clipping floating UI elements.
- Rendering global overlays that need to stay positioned above app navigators and screen content.

---

## Required Setup

Mount `<PortalHost />` as a self-closing sibling next to your root navigation container (e.g. inside `SafeAreaProvider` / `AppThemeProvider`):

```tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppThemeProvider } from './AppThemeProvider';
import { AppNavigator } from './AppNavigator';
import { PortalHost } from '@codexporer.io/expo-portal';

export function RootApp() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <AppNavigator />
        {/* Destination outlet for portaled content */}
        <PortalHost />
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
```

> **IMPORTANT**: `<PortalHost />` is a self-closing component and does **NOT** take or render `children`. Do **NOT** wrap other components inside `<PortalHost>`.

---

## Usage Examples

### 1. Default Portal (Teleporting to 'root' Host)

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Portal } from '@codexporer.io/expo-portal';

export function NestedListItem() {
  return (
    <View style={styles.cell}>
      <Text>Item Row</Text>

      {/* Teleported directly to root PortalHost */}
      <Portal>
        <View style={styles.floatingOverlay} pointerEvents="box-none">
          <Text style={styles.bannerText}>Floating Overlay on Top</Text>
        </View>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    overflow: 'hidden',
    height: 60
  },
  floatingOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999
  },
  bannerText: {
    color: '#ffffff'
  }
});
```

### 2. Named Portal Hosts

You can create independent hosts for specific layers (e.g. modals, tooltips, toasts):

```tsx
import React from 'react';
import { View } from 'react-native';
import { Portal, PortalHost } from '@codexporer.io/expo-portal';

export function ScreenWithCustomHost() {
  return (
    <View style={{ flex: 1 }}>
      <ScreenContent />

      {/* Dedicated named portal host */}
      <PortalHost name="dialogs" />

      {/* Teleport to specific host */}
      <Portal hostName="dialogs">
        <CustomDialog />
      </Portal>
    </View>
  );
}
```

---

## API Reference

### `<PortalHost />` Props
Mounts a destination overlay container (`<View style={[StyleSheet.absoluteFill, style]} pointerEvents="box-none" collapsable={false}>`).

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `'root'` | Identifier of this portal host |
| `style` | `StyleProp<ViewStyle>` | — | Custom container style override |

### `<Portal />` Props
Teleports its `children` into the matching `PortalHost`. Returns `null`.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `React.ReactNode` | — | Content to teleport into the target host |
| `hostName` | `string` | `'root'` | Target host name to render inside |

---

## Critical Rules & Guidelines
1. **Never Wrap with `<PortalHost>`**: `<PortalHost />` renders only the portaled items registered in its host map. It does not accept or render nested children.
2. **Mount `<PortalHost />` at Root**: Place `<PortalHost />` high enough in the view hierarchy (e.g. inside root layout / `App.js`) so that portaled items render above navigators.
3. **Touch Transparency**: The `<PortalHost />` view sets `pointerEvents="box-none"`, meaning empty spaces pass touches through to views underneath. Portaled views that need to capture touches should define their own touch handlers or `pointerEvents="auto"`.
4. **Automatic Cleanup**: Unmounting `<Portal />` cleans up the node from the `PortalManager` map without ghost artifacts or memory leaks.


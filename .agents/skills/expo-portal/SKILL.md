---
name: expo-portal
description: Instructions and guidelines for using @codexporer.io/expo-portal (Expo Portal) in React Native and Expo applications.
---

# `@codexporer.io/expo-portal` Skill

## Overview
`@codexporer.io/expo-portal` teleports React components from deeply nested children into a top-level `<PortalHost />`. This prevents UI clipping caused by ancestor `overflow: hidden`, fixed dimensions, or complex z-indexing.

---

## When to Use
- Rendering modals, dialogs, full-screen loaders, or floating menus from deep within the component tree.
- Preventing scroll containers from clipping floating UI elements.

---

## Required Setup

Wrap your application root with `<PortalHost>`:

```tsx
import React from 'react';
import { PortalHost } from '@codexporer.io/expo-portal';

export function RootApp({ children }: { children: React.ReactNode }) {
  return (
    <PortalHost>
      {children}
    </PortalHost>
  );
}
```

---

## Usage Example

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
          {/* Floating UI content */}
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
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999
  }
});
```

---

## API Reference

### `<PortalHost />` Props
| Prop | Type | Description |
| :--- | :--- | :--- |
| `children` | `ReactNode` | The base component tree wrapped by the portal host |

### `<Portal />` Props
| Prop | Type | Description |
| :--- | :--- | :--- |
| `children` | `ReactNode` | Content to be teleported into the nearest `PortalHost` |

---

## Critical Rules & Guidelines
1. **Always Mount `<PortalHost>`**: A `<Portal>` will not render its content if no ancestor `<PortalHost>` exists.
2. **Handle Touch Events**: Use `pointerEvents="box-none"` on full-screen portal containers so touches pass through to underlying screens.

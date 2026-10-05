# `@codexporer.io/expo-portal`

A lightweight, unopinionated, non-modal portal solution for React Native and Expo applications. Allows teleporting components (dialogs, tooltips, action sheets, dropdowns, floating menus) to a top-level host without native modal constraints.

## Installation & Peer Dependencies

```bash
yarn add @codexporer.io/expo-portal
```

Peer dependencies:
- `react` (`*`)
- `react-native` (`*`)

## Quick Start

### 1. Place `PortalHost` at the root of your application

`PortalHost` renders beside your app components (e.g. after dialogs and navigation containers) and acts as the destination outlet for all portaled elements:

```tsx
import React from 'react';
import { View } from 'react-native';
import { PortalHost } from '@codexporer.io/expo-portal';
import { AppScreensContainer } from './AppScreensContainer';
import { MessageDialog } from './MessageDialog';

export function App() {
  return (
    <View style={{ flex: 1 }}>
      <AppScreensContainer />
      <MessageDialog />
      <PortalHost />
    </View>
  );
}
```

### 2. Render elements into the portal from anywhere

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Portal } from '@codexporer.io/expo-portal';

export function NestedComponent() {
  return (
    <View style={styles.container}>
      <Text>Screen Content</Text>

      {/* Teleported to the root PortalHost */}
      <Portal>
        <View style={styles.floatingBanner}>
          <Text style={styles.bannerText}>Floating Banner on Top</Text>
        </View>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  floatingBanner: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 8
  },
  bannerText: {
    color: '#fff',
    textAlign: 'center'
  }
});
```

## Named Hosts

You can create independent hosts for specific UI layers (e.g. modals, tooltips, toasts):

```tsx
import React from 'react';
import { View } from 'react-native';
import { Portal, PortalHost } from '@codexporer.io/expo-portal';

export function ScreenWithCustomHost() {
  return (
    <View style={{ flex: 1 }}>
      <MyScreenContent />

      {/* Custom target host */}
      <PortalHost name="dialogs" />

      {/* Target the specific host */}
      <Portal hostName="dialogs">
        <MyDialog />
      </Portal>
    </View>
  );
}
```

## API Reference

### `<Portal />`

Teleports its `children` into the designated `PortalHost`.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | — | Elements to teleport |
| `hostName` | `string` | `'root'` | Target host name to render inside |

### `<PortalHost />`

Mounts a destination overlay container for portaled elements.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `'root'` | Identifier of this portal host |
| `style` | `StyleProp<ViewStyle>` | — | Container style override (`StyleSheet.absoluteFill` by default) |

## License

MIT
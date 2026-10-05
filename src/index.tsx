import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    StyleProp,
    ViewStyle
} from 'react-native';

const DEFAULT_PORTAL_HOST = 'root';

type PortalListener = (nodes: Map<string, React.ReactNode>) => void;

class PortalManager {
    private hosts = new Map<string, {
        nodes: Map<string, React.ReactNode>;
        listeners: Set<PortalListener>;
    }>();

    private getHost(hostName: string) {
        let host = this.hosts.get(hostName);
        if (!host) {
            host = {
                nodes: new Map(),
                listeners: new Set()
            };
            this.hosts.set(hostName, host);
        }
        return host;
    }

    mount(hostName: string, id: string, node: React.ReactNode) {
        const host = this.getHost(hostName);
        host.nodes.set(id, node);
        this.notify(host);
    }

    update(hostName: string, id: string, node: React.ReactNode) {
        const host = this.getHost(hostName);
        host.nodes.set(id, node);
        this.notify(host);
    }

    unmount(hostName: string, id: string) {
        const host = this.getHost(hostName);
        if (host.nodes.delete(id)) {
            this.notify(host);
        }
    }

    subscribe(hostName: string, listener: PortalListener) {
        const host = this.getHost(hostName);
        host.listeners.add(listener);
        listener(new Map(host.nodes));
        return () => {
            host.listeners.delete(listener);
        };
    }

    private notify(host: { nodes: Map<string, React.ReactNode>; listeners: Set<PortalListener> }) {
        const copy = new Map(host.nodes);
        host.listeners.forEach(listener => listener(copy));
    }
}

const portalManager = new PortalManager();

export interface PortalHostProps {
    name?: string;
    style?: StyleProp<ViewStyle>;
}

export const PortalHost: React.FC<PortalHostProps> = ({
    name = DEFAULT_PORTAL_HOST,
    style
}) => {
    const [portals, setPortals] = useState<Map<string, React.ReactNode>>(new Map());

    useEffect(() => {
        return portalManager.subscribe(name, nodes => {
            setPortals(nodes);
        });
    }, [name]);

    return (
        <View
            style={[StyleSheet.absoluteFill, style]}
            pointerEvents='box-none'
            collapsable={false}
        >
            {Array.from(portals.entries()).map(([id, node]) => (
                <React.Fragment key={id}>
                    {node}
                </React.Fragment>
            ))}
        </View>
    );
};

export interface PortalProps {
    hostName?: string;
    children: React.ReactNode;
}

let nextPortalId = 0;

export const Portal: React.FC<PortalProps> = ({
    hostName = DEFAULT_PORTAL_HOST,
    children
}) => {
    const idRef = useRef<string | null>(null);
    if (!idRef.current) {
        nextPortalId += 1;
        idRef.current = `portal_${nextPortalId}`;
    }
    const id = idRef.current;

    useEffect(() => {
        portalManager.mount(hostName, id, children);
        return () => {
            portalManager.unmount(hostName, id);
        };
    }, [hostName, id]);

    useEffect(() => {
        portalManager.update(hostName, id, children);
    }, [hostName, id, children]);

    return null;
};

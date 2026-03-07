'use client';

import { useSyncExternalStore } from 'react';

interface ClientTimeProps {
  isoString: string;
}

// Simple store to track client-side mounting
const emptySubscribe = () => () => {};

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function ClientTime({ isoString }: ClientTimeProps) {
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  if (!mounted) {
    return null;
  }

  return <>{new Date(isoString).toLocaleTimeString()}</>;
}

'use client';

import { useCallback, useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

type InstallStatus = 'unsupported' | 'installable' | 'installed' | 'dismissed';

export const useInstallPrompt = () => {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [status, setStatus] = useState<InstallStatus>('unsupported');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect if already running as an installed app.
    const installed =
      window.matchMedia('(display-mode: standalone)').matches ||
      // iOS Safari exposes navigator.standalone
      ((window.navigator as Navigator & { standalone?: boolean }).standalone ??
        false);

    if (installed) {
      // Reading external display-mode state on mount — canonical use of
      // "sync React with an external system" effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('installed');
      return;
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setEvent(e as BeforeInstallPromptEvent);
      setStatus('installable');
    };

    const onInstalled = () => {
      setStatus('installed');
      setEvent(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const prompt = useCallback(async () => {
    if (!event) return null;
    await event.prompt();
    const choice = await event.userChoice;
    setEvent(null);
    setStatus(choice.outcome === 'accepted' ? 'installed' : 'dismissed');
    return choice.outcome;
  }, [event]);

  return { status, prompt, canInstall: event !== null };
};

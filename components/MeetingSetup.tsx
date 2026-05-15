'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useBackgroundFilters,
  useCall,
  useCallStateHooks,
  VideoPreview,
} from '@stream-io/video-react-sdk';
import {
  ArrowLeft,
  CalendarClock,
  Camera,
  ChevronsUpDown,
  Loader2,
  Mic,
  Mic2,
  MicOff,
  Sparkle,
  Sparkles,
  Users2,
  Video,
  Volume2,
} from 'lucide-react';

import { Button } from './ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { cn } from '@/lib/utils';
import { formatRelative } from '@/lib/format';

type BlurLevel = 'off' | 'low' | 'medium' | 'high';

const BLUR_OPTIONS: { id: BlurLevel; label: string; description: string }[] = [
  { id: 'off', label: 'Off', description: 'Show your real background' },
  { id: 'low', label: 'Light', description: 'A soft focus blur' },
  { id: 'medium', label: 'Medium', description: 'Recommended balance' },
  { id: 'high', label: 'Strong', description: 'Maximum privacy blur' },
];

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const router = useRouter();
  const [joinSilent, setJoinSilent] = useState(false);
  const [blur, setBlur] = useState<BlurLevel>('off');

  const call = useCall();
  const {
    isSupported: blurSupported,
    isReady: blurReady,
    isLoading: blurLoading,
    applyBackgroundBlurFilter,
    disableBackgroundFilter,
  } = useBackgroundFilters();

  const { useCameraState, useMicrophoneState, useSpeakerState } =
    useCallStateHooks();
  const cameraState = useCameraState();
  const micState = useMicrophoneState();
  const speakerState = useSpeakerState();

  if (!call) {
    throw new Error('useCall must be used within StreamCall component');
  }

  // Mic and camera follow the "Join silent" toggle.
  useEffect(() => {
    if (joinSilent) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [joinSilent, call?.camera, call?.microphone]);

  // Apply blur live to the preview.
  useEffect(() => {
    if (!blurSupported || !blurReady) return;
    if (blur === 'off') disableBackgroundFilter();
    else applyBackgroundBlurFilter(blur);
  }, [
    blur,
    blurSupported,
    blurReady,
    applyBackgroundBlurFilter,
    disableBackgroundFilter,
  ]);

  const customDescription = call.state.custom?.description as
    | string
    | undefined;
  const startsAt = call.state.startsAt
    ? new Date(call.state.startsAt)
    : undefined;
  const members = call.state.members?.length ?? 0;

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-8">
      <div className="surface-panel mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 sm:p-10">
        {/* Top row — back button + eyebrow pill */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-3.5 py-1.5 text-xs text-muted-soft transition hover:bg-white/[0.07] hover:text-white"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to dashboard
          </button>
          <span className="pill pill-active">
            <Sparkles className="h-3.5 w-3.5" />
            Pre-flight check
          </span>
        </div>

        <div className="flex flex-col gap-1.5 text-center">
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Ready when you are
          </h1>
          <p className="text-sm text-muted-soft">
            Tune your camera, mic, and background before stepping into the room.
          </p>
        </div>

        {/* Main grid — preview on the left, settings on the right */}
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-ink-900/60 aspect-video">
              <VideoPreview />
              {joinSilent && (
                <div className="absolute inset-0 flex items-center justify-center bg-ink-950/85 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-muted-soft">
                      <Video className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-medium text-white">
                      Camera off
                    </p>
                    <p className="text-xs text-muted-soft">
                      You&apos;ll join with your camera disabled.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <MicLevelMeter />

            {/* Meeting context */}
            <section className="surface-card flex flex-col gap-3 p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted">
                You&apos;re joining
              </p>
              <h2 className="font-display text-lg font-semibold text-white">
                {customDescription ?? 'Instant Meeting'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {startsAt && (
                  <span className="pill">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {formatRelative(startsAt)}
                  </span>
                )}
                <span className="pill">
                  <Users2 className="h-3.5 w-3.5" />
                  {members === 0
                    ? 'No invited members yet'
                    : `${members} invited`}
                </span>
              </div>
            </section>
          </div>

          {/* Right column — settings expanded */}
          <div className="flex flex-col gap-3">
            <DeviceRow
              icon={Camera}
              label="Camera"
              value={cameraState.selectedDevice}
              devices={cameraState.devices}
              onSelect={(id) => call.camera.select(id)}
              status={cameraState.status}
              disabled={joinSilent}
            />
            <DeviceRow
              icon={Mic2}
              label="Microphone"
              value={micState.selectedDevice}
              devices={micState.devices}
              onSelect={(id) => call.microphone.select(id)}
              status={micState.status}
              disabled={joinSilent}
            />
            <DeviceRow
              icon={Volume2}
              label="Speaker"
              value={speakerState.selectedDevice}
              devices={speakerState.devices}
              onSelect={(id) => call.speaker.select(id)}
              disabledHint={
                speakerState.devices?.length === 0
                  ? 'Browser uses system default'
                  : undefined
              }
            />

            {/* Blur tiles */}
            <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint-400/15 text-mint-300">
                  {blurLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkle className="h-4 w-4" />
                  )}
                </span>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">
                      Background blur
                    </p>
                    {!blurSupported && (
                      <span className="rounded-full border border-white/5 bg-white/[0.04] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-muted">
                        Not supported
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-soft">
                    {blurSupported
                      ? joinSilent
                        ? 'Enable your camera to preview blur.'
                        : 'Hide what’s behind you — preview is live.'
                      : 'Your browser doesn’t support background filters.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {BLUR_OPTIONS.map((opt) => {
                  const active = blur === opt.id;
                  const disabled = !blurSupported;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setBlur(opt.id)}
                      disabled={disabled}
                      aria-pressed={active}
                      title={opt.description}
                      className={cn(
                        'flex flex-col items-start gap-0.5 rounded-2xl border px-3 py-2 text-left transition',
                        'disabled:cursor-not-allowed disabled:opacity-40',
                        active && !disabled
                          ? 'border-mint-400/40 bg-mint-400/15 text-mint-200'
                          : 'border-white/5 bg-white/[0.02] text-muted-soft hover:border-white/10 hover:bg-white/[0.04] hover:text-white',
                      )}
                    >
                      <span className="text-xs font-semibold text-white">
                        {opt.label}
                      </span>
                      <span className="text-[10px] leading-tight">
                        {opt.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Join silent toggle */}
            <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-muted-soft">
                  {joinSilent ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4 text-mint-300" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">
                    Join with mic and camera off
                  </p>
                  <p className="text-xs text-muted-soft">
                    Enable inside the room when ready.
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={joinSilent}
                onClick={() => setJoinSilent((v) => !v)}
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition',
                  joinSilent ? 'bg-mint-400' : 'bg-white/10',
                )}
              >
                <span
                  className={cn(
                    'inline-block h-5 w-5 transform rounded-full bg-ink-950 transition',
                    joinSilent ? 'translate-x-5' : 'translate-x-0.5',
                  )}
                />
              </button>
            </label>
          </div>
        </div>

        <Button
          onClick={() => {
            call.join();
            setIsSetupComplete(true);
          }}
          className="h-12 w-full rounded-full bg-mint-400 text-base font-semibold text-ink-950 hover:bg-mint-300"
        >
          Join meeting
        </Button>
      </div>
    </div>
  );
};

/* ----------------------- Device selector ----------------------- */

type DeviceRowProps = {
  icon: typeof Camera;
  label: string;
  value?: string;
  devices?: MediaDeviceInfo[];
  onSelect: (deviceId: string) => void;
  status?: string;
  disabled?: boolean;
  disabledHint?: string;
};

const DeviceRow = ({
  icon: Icon,
  label,
  value,
  devices,
  onSelect,
  status,
  disabled,
  disabledHint,
}: DeviceRowProps) => {
  const options = devices ?? [];
  const selected = options.find((d) => d.deviceId === value);
  const current = selected?.label || options[0]?.label || 'System default';

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3',
        disabled && 'opacity-60',
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-muted-soft">
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[10px] uppercase tracking-[0.22em] text-muted">
          {label}
        </span>
        <span className="truncate text-sm font-medium text-white">
          {current}
        </span>
        {disabledHint && (
          <span className="text-[10px] text-muted">{disabledHint}</span>
        )}
        {status && (
          <span className="text-[10px] text-muted-soft">{status}</span>
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={options.length === 0 || disabled}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] text-muted-soft transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Change ${label}`}
          >
            <ChevronsUpDown className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 p-1">
          <p className="px-2 py-1.5 text-[10px] uppercase tracking-[0.24em] text-muted">
            {label}
          </p>
          <div className="max-h-64 overflow-y-auto">
            {options.length === 0 ? (
              <p className="px-2 py-2 text-xs text-muted-soft">
                No devices detected.
              </p>
            ) : (
              options.map((device) => {
                const isSelected = device.deviceId === value;
                return (
                  <button
                    key={device.deviceId}
                    type="button"
                    onClick={() => onSelect(device.deviceId)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-xs transition',
                      isSelected
                        ? 'bg-mint-400/15 text-mint-200'
                        : 'text-muted-soft hover:bg-white/[0.04] hover:text-white',
                    )}
                  >
                    <span
                      className={cn(
                        'h-1.5 w-1.5 shrink-0 rounded-full',
                        isSelected ? 'bg-mint-300' : 'bg-white/15',
                      )}
                    />
                    <span className="truncate">
                      {device.label || `${label} (no label)`}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

/* ----------------------- Mic level meter ----------------------- */

const BAR_COUNT = 16;

/**
 * Live audio-level meter for the microphone preview. Uses an AnalyserNode on
 * the local audio track so the user can confirm the mic is picking up sound
 * before joining the call.
 */
const MicLevelMeter = () => {
  const { useMicrophoneState } = useCallStateHooks();
  const micState = useMicrophoneState();
  const [levels, setLevels] = useState<number[]>(() =>
    new Array(BAR_COUNT).fill(0),
  );
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const stream = micState.mediaStream;
    if (!stream || micState.isMute) {
      setLevels(new Array(BAR_COUNT).fill(0));
      return;
    }

    // Lazily-created AnalyserNode for the active stream.
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.7;
    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(data);
      const next = new Array(BAR_COUNT).fill(0).map((_, i) => {
        const slice = Math.floor((i / BAR_COUNT) * data.length);
        return data[slice] / 255;
      });
      setLevels(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      source.disconnect();
      ctx.close().catch(() => {});
    };
  }, [micState.mediaStream, micState.isMute]);

  const muted = micState.isMute;
  const peak = useMemo(() => Math.max(...levels), [levels]);

  return (
    <div className="surface-card flex items-center gap-3 p-3">
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition',
          muted
            ? 'bg-white/[0.05] text-muted-soft'
            : peak > 0.4
              ? 'bg-mint-400/20 text-mint-300'
              : 'bg-mint-400/10 text-mint-300',
        )}
      >
        {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </span>
      <div className="flex flex-1 items-center gap-[2px]">
        {levels.map((v, i) => (
          <span
            key={i}
            className={cn(
              'h-4 flex-1 rounded-full transition-all duration-75',
              muted
                ? 'bg-white/[0.05]'
                : v > 0.6
                  ? 'bg-mint-300'
                  : v > 0.25
                    ? 'bg-mint-400/70'
                    : 'bg-white/10',
            )}
            style={{ transform: `scaleY(${Math.max(0.18, muted ? 0.18 : v)})` }}
          />
        ))}
      </div>
      <span className="text-[10px] uppercase tracking-[0.22em] text-muted">
        {muted ? 'Muted' : peak > 0.05 ? 'Picking up' : 'Silence'}
      </span>
    </div>
  );
};

export default MeetingSetup;

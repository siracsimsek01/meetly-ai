const Loader = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="relative inline-flex h-12 w-12 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-mint-400/30" />
          <span className="absolute inset-2 rounded-full border-2 border-mint-400/40 border-t-mint-400 animate-spin" />
          <span className="h-2 w-2 rounded-full bg-mint-400 shadow-[0_0_24px_4px_rgba(54,240,182,0.6)]" />
        </span>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Loading</p>
      </div>
    </div>
  );
};

export default Loader;

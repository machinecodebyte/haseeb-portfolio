export function RouteLoading() {
  return (
    <main
      className="grid min-h-screen place-items-center bg-background px-6 pt-24"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="w-full max-w-3xl border bg-card p-6 sm:p-8">
        <div className="h-px w-12 bg-primary" aria-hidden />
        <p className="label-mono mt-4 text-muted-foreground">Loading portfolio page</p>
      </div>
    </main>
  );
}

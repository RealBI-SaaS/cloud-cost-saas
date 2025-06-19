export function Loading() {

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
          <div className="relative animate-bounce rounded-full h-12 w-12 bg-primary"></div>
        </div>
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );

}

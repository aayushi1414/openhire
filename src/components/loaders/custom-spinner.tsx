import { Spinner } from "../ui/spinner";

export function CustomSpinner() {
  return (
    <div className="flex w-full flex-col items-center gap-4 justify-center min-h-60">
      <Spinner className="size-10 text-primary" />
      <div className="text-center space-y-2">
        <p className="text-primary text-lg font-bold">Creating Questions</p>
        <p className="text-muted-foreground text-sm max-w-sm">
          We're creating intelligent questions based on the interview objectives. This will take few
          moments...
        </p>
      </div>
    </div>
  );
}

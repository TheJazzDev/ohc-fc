import { HeroBall } from "./HeroBall";

export function HeroBallStage() {
  return (
    <div className="relative mx-auto h-44 w-44 sm:h-56 sm:w-56 lg:h-[260px] lg:w-[260px]">
      <div className="animate-flood-pulse absolute -inset-[12%] rounded-full bg-[radial-gradient(circle,oklch(0.87_0.22_125_/_0.5)_0%,oklch(0.87_0.22_125_/_0.16)_38%,transparent_70%)] blur-md motion-reduce:animate-none" />
      <HeroBall />
    </div>
  );
}

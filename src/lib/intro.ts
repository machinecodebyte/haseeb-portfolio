export const introReadyEvent = "ha:intro-ready";
export const introCompleteEvent = "ha:intro-done";

let introCompletedInDocument = false;
let introStartedInDocument = false;

export function hasCompletedIntro() {
  return introCompletedInDocument;
}

export function hasStartedIntro() {
  return introStartedInDocument;
}

export function startIntro() {
  introStartedInDocument = true;
}

export function isIntroReady() {
  return (
    typeof document !== "undefined" && document.documentElement.dataset["haIntroReady"] === "true"
  );
}

export function signalIntroReady() {
  if (typeof window === "undefined") return;
  if (document.documentElement.dataset["haIntroReady"] === "true") return;
  document.documentElement.dataset["haIntroReady"] = "true";
  window.dispatchEvent(new Event(introReadyEvent));
}

export function completeIntro() {
  if (introCompletedInDocument) return;
  introCompletedInDocument = true;
  if (typeof window !== "undefined") window.dispatchEvent(new Event(introCompleteEvent));
}

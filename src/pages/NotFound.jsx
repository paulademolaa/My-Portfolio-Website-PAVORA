import Button from "../components/Button.jsx";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-6 pt-32 text-center">
      <p className="font-display text-[120px] leading-none font-bold tracking-[-0.04em] text-ink-700">404</p>
      <h1 className="font-display text-[32px] leading-[1.2] font-medium">This page doesn't exist.</h1>
      <Button to="/">Back to home</Button>
    </section>
  );
}

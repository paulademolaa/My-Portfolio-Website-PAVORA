// Small illustrations from the Figma design (browser, phones, brand board,
// slide deck). They're drawn with plain divs so there are no image files.
// Usage: <Mockup kind="web" />  — kinds: "web", "mobile", "brand", "deck"

function Bar({ className }) {
  return <div className={`rounded ${className}`} />;
}

function Browser() {
  return (
    <div className="w-[460px] shrink-0 overflow-hidden rounded-[14px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="flex gap-1.5 bg-[#f2f4f7] px-3.5 py-3">
        <span className="size-2 rounded-full bg-[#d0d5dd]" />
        <span className="size-2 rounded-full bg-[#d0d5dd]" />
        <span className="size-2 rounded-full bg-[#d0d5dd]" />
      </div>
      <div className="flex flex-col gap-3 px-7 py-6">
        <Bar className="h-2 w-[60px] bg-blue-600" />
        <Bar className="h-[18px] w-[300px] bg-[#101828]" />
        <Bar className="h-[18px] w-[240px] bg-[#101828]" />
        <Bar className="h-2 w-[280px] bg-[#d0d5dd]" />
        <Bar className="h-2 w-[220px] bg-[#d0d5dd]" />
        <div className="flex gap-2">
          <span className="h-[26px] w-[84px] rounded-full bg-blue-600" />
          <span className="h-[26px] w-[84px] rounded-full border border-[#d0d5dd]" />
        </div>
        <div className="flex gap-2.5">
          <span className="h-[70px] w-32 rounded-lg bg-blue-100" />
          <span className="h-[70px] w-32 rounded-lg bg-blue-200" />
          <span className="h-[70px] w-32 rounded-lg bg-blue-100" />
        </div>
      </div>
    </div>
  );
}

function Phone({ dark }) {
  return (
    <div
      className={`flex h-[350px] w-[170px] shrink-0 flex-col gap-2.5 rounded-[30px] border-[5px] border-[#101828] px-4 py-7 ${
        dark ? "bg-[#101828]" : "bg-white"
      }`}
    >
      <Bar className={`h-1.5 w-[50px] ${dark ? "bg-blue-500" : "bg-blue-600"}`} />
      <Bar className={`h-3.5 w-[130px] ${dark ? "bg-white" : "bg-[#101828]"}`} />
      <Bar className={`h-3.5 w-[100px] ${dark ? "bg-white" : "bg-[#101828]"}`} />
      <div className={`h-[110px] w-32 rounded-[14px] ${dark ? "bg-[#344054]" : "bg-blue-100"}`} />
      <Bar className={`h-1.5 w-[120px] ${dark ? "bg-slate-400" : "bg-[#d0d5dd]"}`} />
      <Bar className={`h-1.5 w-[90px] ${dark ? "bg-slate-400" : "bg-[#d0d5dd]"}`} />
      <span className="h-8 w-32 rounded-2xl bg-blue-600" />
    </div>
  );
}

function Brand() {
  return (
    <div className="flex flex-col items-center gap-7">
      <div className="grid size-[150px] place-items-center rounded-full bg-blue-600 font-display text-[64px] font-bold">
        A.
      </div>
      <div className="flex gap-2.5">
        {["bg-blue-600", "bg-blue-200", "bg-white", "bg-slate-400"].map((c) => (
          <span key={c} className={`size-11 rounded-[10px] ${c}`} />
        ))}
      </div>
    </div>
  );
}

function Deck() {
  return (
    <div className="relative h-[300px] w-[460px] shrink-0">
      <div className="absolute top-0 left-[50px] h-[203px] w-[360px] rounded-[10px] bg-blue-200" />
      <div className="absolute top-[25px] left-[25px] h-[203px] w-[360px] rounded-[10px] bg-white" />
      <div className="absolute top-[55px] left-0 flex h-[203px] w-[360px] flex-col gap-2.5 rounded-[10px] bg-[#101828] p-6">
        <Bar className="h-1.5 w-10 bg-blue-500" />
        <Bar className="h-3.5 w-[200px] bg-white" />
        <Bar className="h-3.5 w-[150px] bg-white" />
        <div className="flex h-[70px] items-end gap-2">
          {[30, 45, 38, 60, 52].map((h, i) => (
            <span
              key={i}
              style={{ height: h }}
              className={`w-[22px] rounded-[3px] ${i === 3 ? "bg-blue-500" : "bg-[#344054]"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const backgrounds = {
  web: "bg-blue-600",
  mobile: "bg-blue-200",
  brand: "bg-ink-800",
  deck: "bg-blue-100",
};

export default function Mockup({ kind = "web", className = "" }) {
  return (
    <div
      className={`relative grid place-items-center overflow-hidden rounded-xl ${backgrounds[kind]} ${className}`}
    >
      {/* scale-down keeps the illustration inside smaller boxes */}
      <div className="origin-center scale-[0.62] transition-transform duration-700 ease-(--ease-premium) group-hover:scale-[0.7] sm:scale-[0.8] sm:group-hover:scale-[0.88]">
        {kind === "web" && <Browser />}
        {kind === "mobile" && (
          <div className="flex gap-6">
            <Phone />
            <Phone dark />
          </div>
        )}
        {kind === "brand" && <Brand />}
        {kind === "deck" && <Deck />}
      </div>
    </div>
  );
}

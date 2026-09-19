"use client";

export default function TopHeader() {
  return (
    <header className="h-14 border-b border-[#EAE2D6] bg-[#F7F2EB]/90 backdrop-blur-sm sticky top-0 z-30 px-6 flex items-center justify-end">
      {/* Account Logo / Analyst Avatar */}
      <div className="w-7 h-7 rounded-full bg-[#8B9A6E] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
        AS
      </div>
    </header>
  );
}

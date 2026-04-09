export default function ClientPortalNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-[#EEEBE3] flex items-center justify-center mb-6">
        <span className="text-[24px] text-[#78756C]">?</span>
      </div>
      <h1 className="text-[18px] font-semibold text-[#1A1916] mb-2">
        Invalid or Expired Link
      </h1>
      <p className="text-[13px] text-[#78756C] max-w-md">
        This portal link is no longer valid. Please contact your team at Known Local
        to request a new link.
      </p>
    </div>
  )
}

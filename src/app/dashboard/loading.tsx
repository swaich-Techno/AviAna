export default function DashboardLoading() {
  return (
    <div>
      <div className="h-10 w-56 animate-pulse rounded-md bg-[#eadfce]" />
      <div className="dashboard-grid mt-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-lg border border-[#eadfce] bg-[#fffdf8]" />
        ))}
      </div>
    </div>
  );
}

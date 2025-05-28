import { cn } from "@/lib/utils"

export function StatCard({ title, value, description, icon, className }) {
  return (
    <div className={cn("bg-white p-6 rounded-xl shadow-sm border border-gray-100", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {description && (
          <p className="ml-2 text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  )
}

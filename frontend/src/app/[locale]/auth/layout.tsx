export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 md:p-10 bg-gray-500">
      <div className="flex flex-col w-full max-w-sm gap-6">
        {children}
      </div>
    </div>
  )
}

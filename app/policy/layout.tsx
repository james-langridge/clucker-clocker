export default async function Layout({children}: {children: React.ReactNode}) {
  return (
    <main className="flex-auto w-full max-w-prose px-4 py-4 mx-auto sm:px-6 md:py-6">
      {children}
    </main>
  )
}

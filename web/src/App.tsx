import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const DEMO_USER = 'u1'

type Rule = {
  id: string
  type: string
  params: Record<string, unknown>
  enabled: boolean
  priority: number
  createdAt: string
}

export default function App() {
  const [health, setHealth] = useState<'ok' | 'down' | 'loading'>('loading')
  const [rules, setRules] = useState<Rule[]>([])
  const [loadingRules, setLoadingRules] = useState(false)
  const [posting, setPosting] = useState(false)
  const apiRules = useMemo(() => `${API_BASE}/users/${DEMO_USER}/rules`, [])

  useEffect(() => {
    fetch(`${API_BASE}/healthz`).then(async (r) => {
      setHealth(r.ok ? 'ok' : 'down')
    }).catch(() => setHealth('down'))
  }, [])

  const loadRules = async () => {
    setLoadingRules(true)
    try {
      const res = await fetch(apiRules)
      const data = await res.json()
      setRules(Array.isArray(data) ? data : [])
    } finally {
      setLoadingRules(false)
    }
  }

  useEffect(() => {
    loadRules()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addDemoRule = async () => {
    setPosting(true)
    try {
      const demo: Rule = {
        id: `r-${Date.now()}`,
        type: 'keyword',
        params: { k: 'newsletter' },
        enabled: true,
        priority: Math.max(10, (rules[0]?.priority ?? 10) + 10),
        createdAt: new Date().toISOString(),
      }
      await fetch(apiRules, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(demo) })
      await loadRules()
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="container max-w-6xl flex items-center justify-between py-3">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <i className="fa-solid fa-broom text-indigo-600" aria-hidden />
            <span>cdspam</span>
            <span className="hidden sm:inline text-sm text-gray-500">— Gmail Cleaner</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <a className="hover:text-indigo-600" href="#rules"><i className="fa-solid fa-list-ul mr-1" aria-hidden />Reglas</a>
            <a className="hover:text-indigo-600" href="#whitelist"><i className="fa-solid fa-user-shield mr-1" aria-hidden />Whitelist</a>
            <a className="hover:text-indigo-600" href="#candidates"><i className="fa-solid fa-inbox mr-1" aria-hidden />Candidatos</a>
            <a className="hover:text-indigo-600" href="#audit"><i className="fa-solid fa-clock-rotate-left mr-1" aria-hidden />Auditoría</a>
          </nav>
        </div>
      </header>

      <main className="container max-w-6xl py-6 space-y-8">
        <section aria-labelledby="health" className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <h2 id="health" className="text-lg font-medium">Salud API</h2>
            <span className={`inline-flex items-center gap-2 text-sm ${health === 'ok' ? 'text-green-600' : health === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
              <i className={`fa-solid ${health === 'ok' ? 'fa-circle-check' : health === 'down' ? 'fa-triangle-exclamation' : 'fa-spinner fa-spin'}`} aria-hidden />
              {health === 'loading' ? 'Comprobando…' : health === 'ok' ? 'Operativa' : 'Caída'}
            </span>
          </div>
        </section>

        <section id="rules" aria-labelledby="rules-title" className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 id="rules-title" className="text-lg font-medium flex items-center gap-2">
              <i className="fa-solid fa-list-ul text-indigo-600" aria-hidden />
              Reglas ({rules.length})
            </h2>
            <div className="flex gap-2">
              <button onClick={loadRules} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm">
                <i className="fa-solid fa-rotate" aria-hidden />Refrescar
              </button>
              <button disabled={posting} onClick={addDemoRule} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm">
                <i className="fa-solid fa-plus" aria-hidden />Añadir demo
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="py-2 pr-3">ID</th>
                  <th className="py-2 pr-3">Tipo</th>
                  <th className="py-2 pr-3">Prioridad</th>
                  <th className="py-2 pr-3">Creada</th>
                </tr>
              </thead>
              <tbody>
                {loadingRules && (
                  <tr><td colSpan={4} className="py-4 text-center text-gray-500"><i className="fa-solid fa-spinner fa-spin mr-2" />Cargando…</td></tr>
                )}
                {!loadingRules && rules.length === 0 && (
                  <tr><td colSpan={4} className="py-4 text-center text-gray-500">No hay reglas todavía</td></tr>
                )}
                {rules.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-3 font-mono text-xs">{r.id}</td>
                    <td className="py-2 pr-3">{r.type}</td>
                    <td className="py-2 pr-3">{r.priority}</td>
                    <td className="py-2 pr-3">{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="container max-w-6xl py-8 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <i className="fa-brands fa-google" aria-hidden />
          <span>cdspam — MVP • {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}

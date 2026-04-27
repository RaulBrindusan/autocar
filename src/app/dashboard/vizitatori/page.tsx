'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

const PERIODS = [
  { key: '1d',  label: 'Azi' },
  { key: '7d',  label: '7 Zile' },
  { key: '30d', label: '30 Zile' },
  { key: '90d', label: '90 Zile' },
  { key: '1y',  label: '1 An' },
] as const
type Period = (typeof PERIODS)[number]['key']

interface TopPage    { pagePath: string; views: number; uniqueVisitors: number }
interface TimePoint  { bucket: string;  views: number; uniqueVisitors: number }
interface NameCount  { name: string;    count: number }
interface UTMSource  { name: string;    count: number }

interface StatsData {
  totalViews:        number
  uniqueVisitors:    number
  avgDurationMs:     number | null
  bounceRate:        number
  newVisitors:       number
  returningVisitors: number
  avgScrollDepth:    number | null
  topPage:           string | null
  topPages:          TopPage[]
  viewsOverTime:     TimePoint[]
  devices:           NameCount[]
  browsers:          NameCount[]
  os:                NameCount[]
  utmSources:        UTMSource[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(ms: number | null): string {
  if (!ms) return '—'
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return m === 0 ? `${s}s` : `${m}m ${s % 60}s`
}

function formatBucket(bucket: string, period: Period): string {
  const d = new Date(bucket)
  if (period === '1d') return d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
  if (period === '1y') return d.toLocaleDateString('ro-RO', { month: 'short', year: '2-digit' })
  return d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })
}

// ─── Components ───────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, accent,
}: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ?? 'text-gray-900'}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400 truncate">{sub}</p>}
    </div>
  )
}

function BreakdownList({ title, items }: { title: string; items: NameCount[] }) {
  const max = items[0]?.count ?? 1
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      {items.length === 0
        ? <p className="text-xs text-gray-400">Nicio dată</p>
        : (
          <div className="space-y-2.5">
            {items.map(item => (
              <div key={item.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 capitalize">{item.name || '—'}</span>
                  <span className="text-gray-400">{item.count}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${Math.round((item.count / max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

function NewReturningBar({ newV, returning }: { newV: number; returning: number }) {
  const total = newV + returning
  if (total === 0) return <p className="text-xs text-gray-400">Nicio dată</p>
  const newPct = Math.round((newV / total) * 100)
  return (
    <div>
      <div className="flex text-xs mb-1 justify-between">
        <span className="text-blue-600 font-medium">Noi {newPct}%</span>
        <span className="text-emerald-600 font-medium">Revenire {100 - newPct}%</span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        <div className="bg-blue-500 rounded-l-full" style={{ width: `${newPct}%` }} />
        <div className="bg-emerald-500 rounded-r-full flex-1" />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{newV.toLocaleString('ro-RO')} vizitatori noi</span>
        <span>{returning.toLocaleString('ro-RO')} reveniri</span>
      </div>
    </div>
  )
}

// ─── Main content ─────────────────────────────────────────────────────────────

function VizitatoriiContent() {
  const [period, setPeriod] = useState<Period>('30d')
  const [data,    setData]   = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/analytics/stats?period=${period}`)
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(json => { setData(json); setLoading(false) })
      .catch(e  => { setError(e.message); setLoading(false) })
  }, [period])

  const chartData = (data?.viewsOverTime ?? []).map(p => ({
    ...p,
    label: formatBucket(p.bucket, period),
  }))

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vizitatori</h1>
        <p className="text-sm text-gray-500 mt-1">Date proprii din Firestore · fără servicii terțe</p>
      </div>

      {/* Period tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {PERIODS.map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              period === p.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          Eroare: {error}
        </div>
      )}

      {/* Row 1 — core stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Vizualizări"  value={loading ? '…' : (data?.totalViews     ?? 0).toLocaleString('ro-RO')} />
        <StatCard label="Vizitatori Unici"   value={loading ? '…' : (data?.uniqueVisitors ?? 0).toLocaleString('ro-RO')} />
        <StatCard label="Durata Medie"       value={loading ? '…' : formatDuration(data?.avgDurationMs ?? null)} />
        <StatCard
          label="Rată Bounce"
          value={loading ? '…' : `${data?.bounceRate ?? 0}%`}
          accent={!loading && (data?.bounceRate ?? 0) > 60 ? 'text-red-500' : 'text-gray-900'}
        />
      </div>

      {/* Row 2 — engagement stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Vizitatori Noi"     value={loading ? '…' : (data?.newVisitors       ?? 0).toLocaleString('ro-RO')} accent="text-blue-600" />
        <StatCard label="Vizitatori Revenire" value={loading ? '…' : (data?.returningVisitors ?? 0).toLocaleString('ro-RO')} accent="text-emerald-600" />
        <StatCard label="Scroll Mediu"       value={loading ? '…' : (data?.avgScrollDepth != null ? `${data.avgScrollDepth}%` : '—')} />
        <StatCard label="Pagina Top"         value={loading ? '…' : (data?.topPage ?? '—')} />
      </div>

      {/* New vs Returning bar */}
      {!loading && data && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Vizitatori Noi vs Revenire</h2>
          <NewReturningBar newV={data.newVisitors} returning={data.returningVisitors} />
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Vizualizări în timp</h2>
        {loading ? (
          <div className="h-56 flex items-center justify-center text-gray-400 text-sm">Se încarcă…</div>
        ) : chartData.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-gray-400 text-sm">Nicio dată pentru această perioadă</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gViews"  x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="gUniq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                formatter={(v: number | undefined, name: string | undefined) => [
                  v ?? 0,
                  name === 'views' ? 'Vizualizări' : 'Vizitatori Unici',
                ]}
                labelFormatter={l => `Perioadă: ${l}`}
              />
              <Legend formatter={v => v === 'views' ? 'Vizualizări' : 'Vizitatori Unici'} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="views"          stroke="#3b82f6" strokeWidth={2} fill="url(#gViews)" dot={false} />
              <Area type="monotone" dataKey="uniqueVisitors" stroke="#10b981" strokeWidth={2} fill="url(#gUniq)"  dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Device / Browser / OS breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BreakdownList title="Dispozitive"   items={loading ? [] : (data?.devices  ?? [])} />
        <BreakdownList title="Browsere"      items={loading ? [] : (data?.browsers ?? [])} />
        <BreakdownList title="Sisteme de operare" items={loading ? [] : (data?.os ?? [])} />
      </div>

      {/* UTM sources — only shown when data exists */}
      {!loading && (data?.utmSources?.length ?? 0) > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BreakdownList title="Surse UTM (utm_source)" items={data!.utmSources} />
        </div>
      )}

      {/* Top pages table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Cele mai vizitate pagini</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Se încarcă…</div>
        ) : !data?.topPages?.length ? (
          <div className="p-8 text-center text-gray-400 text-sm">Nicio dată disponibilă</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Pagină</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Vizualizări</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Vizitatori Unici</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.topPages.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-700">{p.pagePath}</td>
                  <td className="px-5 py-3 text-right font-medium text-gray-900">{p.views.toLocaleString('ro-RO')}</td>
                  <td className="px-5 py-3 text-right text-gray-600">{p.uniqueVisitors.toLocaleString('ro-RO')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400 text-right">
        Date din Firestore · Tracking propriu · Mixpanel rulează în paralel
      </p>
    </div>
  )
}

export default function VizitatoriiPage() {
  return (
    <ProtectedRoute>
      <VizitatoriiContent />
    </ProtectedRoute>
  )
}

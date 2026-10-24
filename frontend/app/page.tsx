"use client";
import { useState, type FormEvent } from "react";
import { ShieldCheck, Building2, FileCheck2, ClipboardList, UploadCloud, SearchCheck, AlertTriangle, CheckCircle2, Clock3, FileText, ArrowRight, LoaderCircle } from "lucide-react";

type Finding = { severity: string; title: string; detail: string };
type Result = { application_id: string; institution_name: string; status: string; uploaded_documents: string[]; summary: string; findings: Finding[]; disclaimer: string };
const API = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [institution, setInstitution] = useState("Shakti Institute of Technology");
  const [appId, setAppId] = useState("VR-2026-0018");
  const [faculty, setFaculty] = useState("24");
  const [labs, setLabs] = useState("5");
  const [equipment, setEquipment] = useState("86");
  const [files, setFiles] = useState<FileList | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError(""); setResult(null);
    const body = new FormData(); body.append("institution_name", institution); body.append("application_id", appId);
    body.append("faculty_count", faculty); body.append("lab_count", labs); body.append("equipment_count", equipment);
    if (files) Array.from(files).forEach(file => body.append("documents", file));
    try {
      if (!API) throw new Error("Backend URL missing. Set NEXT_PUBLIC_API_URL in Vercel Project Settings → Environment Variables, then redeploy.");
      const response = await fetch(`${API.replace(/\\/$/, "")}/api/verify`, { method: "POST", body });
      if (!response.ok) throw new Error("Backend returned an error. Check that the FastAPI server is running.");
      setResult(await response.json());
    } catch (err) { setError(err instanceof Error ? err.message : "Backend se connect nahi ho pa raha. Check the backend URL and Render logs."); }
    finally { setLoading(false); }
  }

  return <main className="min-h-screen">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3"><div className="rounded-xl bg-indigo-600 p-2.5 text-white"><ShieldCheck size={25}/></div><div><div className="text-lg font-bold tracking-tight">VerifyRight <span className="text-indigo-600">AI</span></div><div className="text-xs text-slate-500">Institutional verification workspace</div></div></div>
      <div className="hidden items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 sm:flex"><span className="h-2 w-2 rounded-full bg-amber-500"/> Prototype mode</div>
    </div></header>
    <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 lg:grid-cols-[230px_1fr]">
      <aside className="hidden space-y-2 lg:block"><div className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Workspace</div><div className="flex items-center gap-3 rounded-xl bg-indigo-50 px-3 py-3 font-semibold text-indigo-700"><ClipboardList size={18}/> Application review</div><div className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-500"><Building2 size={18}/> Institutions</div><div className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-500"><FileCheck2 size={18}/> Compliance checks</div><div className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-500"><Clock3 size={18}/> Audit trail</div><div className="mt-8 rounded-xl border border-slate-200 bg-white p-4"><div className="mb-2 text-sm font-bold">Demo reminder</div><p className="text-xs leading-5 text-slate-500">Use fictional data only. This prototype does not establish authenticity or grant approval.</p></div></aside>
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><div className="mb-2 text-sm font-semibold text-indigo-600">SIH26261 · Application validation</div><h1 className="text-3xl font-bold tracking-tight text-slate-900">Institution verification</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Review application details, supporting evidence and initial compliance signals in one place.</p></div><div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"><span className="text-slate-500">Review queue</span><div className="mt-1 font-bold">Demo workspace <span className="ml-2 text-xs font-medium text-slate-400">Local</span></div></div></div>
        <div className="grid gap-4 sm:grid-cols-3"><Stat icon={<FileText size={19}/>} label="Application" value="Draft review" tone="indigo"/><Stat icon={<SearchCheck size={19}/>} label="Verification engine" value="Ready to run" tone="green"/><Stat icon={<AlertTriangle size={19}/>} label="Decision status" value="Officer review" tone="amber"/></div>
        <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
          <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5 flex items-start justify-between"><div><h2 className="text-lg font-bold">Application details</h2><p className="mt-1 text-sm text-slate-500">Enter sample data and attach evidence.</p></div><div className="rounded-lg bg-slate-100 p-2 text-slate-600"><Building2 size={20}/></div></div>
            <div className="space-y-4"><Field label="Institution name"><input required value={institution} onChange={e=>setInstitution(e.target.value)} className="field" placeholder="Institution name"/></Field><Field label="Application reference ID"><input required value={appId} onChange={e=>setAppId(e.target.value)} className="field" placeholder="VR-2026-0001"/></Field>
              <div className="grid gap-4 sm:grid-cols-3"><Field label="Faculty count"><input type="number" min="0" value={faculty} onChange={e=>setFaculty(e.target.value)} className="field"/></Field><Field label="Laboratories"><input type="number" min="0" value={labs} onChange={e=>setLabs(e.target.value)} className="field"/></Field><Field label="Equipment items"><input type="number" min="0" value={equipment} onChange={e=>setEquipment(e.target.value)} className="field"/></Field></div>
              <Field label="Supporting documents"><label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-7 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40"><UploadCloud size={27} className="mb-2 text-indigo-600"/><span className="text-sm font-semibold text-slate-700">Click to upload documents</span><span className="mt-1 text-xs text-slate-500">PDF, PNG, JPG · use dummy sample files</span><input type="file" multiple accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={e=>setFiles(e.target.files)}/></label>{files && files.length>0 && <div className="mt-2 space-y-1">{Array.from(files).map((f,i)=><div key={i} className="flex items-center gap-2 text-xs text-slate-600"><FileText size={14}/>{f.name}</div>)}</div>}</Field>
              {error && <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
              <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60">{loading?<><LoaderCircle className="animate-spin" size={18}/> Running checks…</>:<>Run initial verification <ArrowRight size={18}/></>}</button>
              <p className="text-xs leading-5 text-slate-400">Prototype checks only. Do not upload real personal, student or confidential institutional records.</p>
            </div>
          </form>
          <div className="space-y-6"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between"><div><h2 className="text-lg font-bold">Verification findings</h2><p className="mt-1 text-sm text-slate-500">Results will appear after you run the checks.</p></div><div className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><SearchCheck size={20}/></div></div>
            {!result ? <div className="mt-6 flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 text-center"><div className="mb-3 rounded-full bg-white p-3 text-slate-400 shadow-sm"><FileCheck2 size={26}/></div><div className="text-sm font-semibold text-slate-700">No verification report yet</div><p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">Submit the sample application to generate initial completeness findings.</p></div> : <div className="mt-5 space-y-4"><div className="rounded-xl bg-slate-50 p-4"><div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current status</div><div className="mt-1 text-lg font-bold text-slate-900">{result.status}</div><p className="mt-1 text-sm text-slate-500">{result.summary}</p></div><div className="space-y-3">{result.findings.map((f,i)=><div key={i} className="flex gap-3 rounded-xl border border-slate-200 p-3"><div className={`mt-0.5 ${f.severity==='high'?'text-rose-600':f.severity==='medium'?'text-amber-600':'text-emerald-600'}`}>{f.severity==='low'?<CheckCircle2 size={19}/>:<AlertTriangle size={19}/>}</div><div><div className="text-sm font-semibold">{f.title}</div><p className="mt-1 text-xs leading-5 text-slate-500">{f.detail}</p></div></div>)}</div><div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">{result.disclaimer}</div><button type="button" onClick={()=>window.print()} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Print / Save report as PDF</button></div>}
          </div><div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-bold">What this prototype checks</h3><div className="mt-4 space-y-3"><MiniCheck text="Required application fields"/><MiniCheck text="Basic count and completeness checks"/><MiniCheck text="Evidence upload tracking"/><MiniCheck text="Officer review hand-off"/></div><div className="mt-4 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">Not yet implemented: official issuer verification, OCR extraction, live regulatory rule database, and tamper detection. These are next development phases.</div></div></div>
        </div>
        <footer className="pb-4 text-center text-xs text-slate-400">VerifyRight AI · SIH26261 prototype · Not an official AICTE or government system</footer>
      </section>
    </div>
    <style jsx global>{`.field{margin-top:7px;width:100%;border:1px solid #dbe2ea;border-radius:10px;padding:11px 12px;font-size:14px;outline:none;background:white}.field:focus{border-color:#818cf8;box-shadow:0 0 0 3px rgba(99,102,241,.12)}@media print{aside,form,header button{display:none!important}body{background:white}}`}</style>
  </main>;
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="block text-sm font-semibold text-slate-700">{label}{children}</label>}
function Stat({icon,label,value,tone}:{icon:React.ReactNode;label:string;value:string;tone:string}){const colors:Record<string,string>={indigo:"bg-indigo-50 text-indigo-700",green:"bg-emerald-50 text-emerald-700",amber:"bg-amber-50 text-amber-700"};return <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className={`rounded-xl p-2.5 ${colors[tone]}`}>{icon}</div><div><div className="text-xs text-slate-500">{label}</div><div className="mt-1 text-sm font-bold">{value}</div></div></div>}
function MiniCheck({text}:{text:string}){return <div className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 size={16} className="text-emerald-600"/>{text}</div>}

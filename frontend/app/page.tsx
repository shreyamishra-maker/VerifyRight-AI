"use client";
import { useState, type FormEvent } from "react";
import { ShieldCheck, Building2, FileCheck2, ClipboardList, UploadCloud, SearchCheck, AlertTriangle, CheckCircle2, Clock3, FileText, ArrowRight, LoaderCircle, Activity, LockKeyhole, ScanSearch, Download } from "lucide-react";

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
  const [tab, setTab] = useState("Application review");
  const [audit, setAudit] = useState([{time:"Session start",action:"Demo workspace opened",detail:"Sample data only"}]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError(""); setResult(null);
    const body = new FormData();
    body.append("institution_name", institution); body.append("application_id", appId);
    body.append("faculty_count", faculty); body.append("lab_count", labs); body.append("equipment_count", equipment);
    if (files) Array.from(files).forEach(file => body.append("documents", file));
    try {
      if (!API) throw new Error("Backend URL missing. Set NEXT_PUBLIC_API_URL in Vercel Project Settings → Environment Variables, then redeploy.");
      const baseUrl = API.endsWith("/") ? API.slice(0, -1) : API;
      const response = await fetch(`${baseUrl}/api/verify`, { method: "POST", body });
      if (!response.ok) throw new Error("Backend returned an error. Check that the FastAPI server is running.");
      const data: Result = await response.json(); setResult(data);
      setAudit(prev => [{time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}),action:"Initial validation executed",detail:`${data.application_id} · ${data.findings.length} finding(s) · demo rules only`},...prev]);
    } catch (err) { setError(err instanceof Error ? err.message : "Backend connection failed. Check the backend URL and Render logs."); }
    finally { setLoading(false); }
  }

  const checks = [
    {label:"Application identity fields",detail:"Institution name and application reference",done:!!result,flag:result?.findings.some(f=>/missing/i.test(f.title))||false},
    {label:"Faculty and infrastructure counts",detail:"Basic numeric sanity checks only",done:!!result,flag:result?.findings.some(f=>/faculty|laboratory|equipment/i.test(f.title))||false},
    {label:"Supporting documents attached",detail:"Presence and filename tracking only",done:!!result,flag:result?.findings.some(f=>/document/i.test(f.title))||false},
    {label:"Issuing-authority authenticity",detail:"Needs authorized portal, API, QR or signature integration",done:false,flag:false},
    {label:"Regulatory rule cross-check",detail:"Needs an approved, current rules source",done:false,flag:false},
  ];
  const nav=[["Application review",ClipboardList],["Institutions",Building2],["Compliance checks",FileCheck2],["Audit trail",Clock3]] as const;

  return <main className="min-h-screen">
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
      <div className="flex items-center gap-3"><div className="rounded-2xl bg-indigo-600 p-2.5 text-white"><ShieldCheck size={25}/></div><div><div className="text-lg font-extrabold">VerifyRight <span className="text-indigo-600">AI</span></div><div className="text-xs text-slate-500">Institutional application assurance</div></div></div>
      <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800"><span className="h-2 w-2 rounded-full bg-amber-500"/> SIH DEMO MODE</div>
    </div></header>
    <div className="mx-auto grid max-w-[1500px] gap-6 px-5 py-7 lg:grid-cols-[245px_1fr] lg:px-8">
      <aside className="space-y-2"><div className="mb-4 px-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">Verification workspace</div>
        {nav.map(([label,Icon])=><button key={label} onClick={()=>setTab(label)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${tab===label?"bg-indigo-600 text-white":"text-slate-600 hover:bg-white"}`}><Icon size={18}/>{label}{label==="Audit trail"&&<span className="ml-auto rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-700">{audit.length}</span>}</button>)}
        <div className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50 p-4"><div className="flex items-center gap-2 text-sm font-bold text-indigo-950"><Activity size={17}/> Workflow</div><p className="mt-2 text-xs leading-5 text-indigo-900/75">Submit sample details → run basic checks → review flags → hand off to a competent officer.</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="mb-2 flex items-center gap-2 text-sm font-bold"><LockKeyhole size={16} className="text-amber-600"/> Important</div><p className="text-xs leading-5 text-slate-500">Not an official AICTE system. Flags are not fraud findings or approval decisions. Do not upload confidential records.</p></div>
      </aside>
      <section className="min-w-0 space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><div className="mb-2 text-sm font-bold text-indigo-600">SIH26261 · AI-assisted application validation</div><h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{tab}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Check application completeness, capture supporting evidence and surface items needing human review.</p></div><div className="rounded-xl border border-slate-200 bg-white px-4 py-3"><div className="text-xs text-slate-500">Active reference</div><div className="mt-1 font-bold">{result?.application_id||appId}</div></div></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat icon={<FileText size={19}/>} label="Application status" value={result?.status||"Awaiting submission"} tone="indigo"/><Stat icon={<ScanSearch size={19}/>} label="Initial findings" value={result?String(result.findings.length):"Not run"} tone="amber"/><Stat icon={<FileCheck2 size={19}/>} label="Documents received" value={result?String(result.uploaded_documents.length):String(files?.length||0)} tone="green"/><Stat icon={<Clock3 size={19}/>} label="Audit events" value={String(audit.length)} tone="slate"/></div>
        {tab==="Application review"&&<div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
          <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5 flex items-start justify-between"><div><h2 className="text-lg font-extrabold">Application details</h2><p className="mt-1 text-sm text-slate-500">Use fictional data and non-sensitive sample documents.</p></div><Building2 className="text-indigo-600" size={22}/></div>
            <div className="space-y-4"><Field label="Institution name"><input required value={institution} onChange={e=>setInstitution(e.target.value)} className="field" placeholder="Institution name"/></Field><Field label="Application reference ID"><input required value={appId} onChange={e=>setAppId(e.target.value)} className="field" placeholder="VR-2026-0001"/></Field>
            <div className="grid gap-4 sm:grid-cols-3"><Field label="Faculty count"><input type="number" min="0" value={faculty} onChange={e=>setFaculty(e.target.value)} className="field"/></Field><Field label="Laboratories"><input type="number" min="0" value={labs} onChange={e=>setLabs(e.target.value)} className="field"/></Field><Field label="Equipment items"><input type="number" min="0" value={equipment} onChange={e=>setEquipment(e.target.value)} className="field"/></Field></div>
            <Field label="Supporting documents"><label className="mt-2 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-7 text-center hover:border-indigo-400 hover:bg-indigo-50/40"><UploadCloud size={28} className="mb-2 text-indigo-600"/><span className="text-sm font-bold">Choose evidence files</span><span className="mt-1 text-xs text-slate-500">PDF, PNG, JPG · demo uploads only</span><input type="file" multiple accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={e=>setFiles(e.target.files)}/></label>{files&&files.length>0&&<div className="mt-3 space-y-2">{Array.from(files).map((f,i)=><div key={i} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600"><FileText size={14} className="text-indigo-600"/><span className="flex-1 truncate">{f.name}</span><span>{(f.size/1024).toFixed(0)} KB</span></div>)}</div>}</Field>
            {error&&<div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60">{loading?<><LoaderCircle className="animate-spin" size={18}/> Running checks…</>:<>Run initial validation <ArrowRight size={18}/></>}</button><p className="text-xs leading-5 text-slate-400">Current checks use submitted fields and file presence. Document contents are not OCR-scanned.</p></div>
          </form>
          <div className="space-y-6"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between"><div><h2 className="text-lg font-extrabold">Review findings</h2><p className="mt-1 text-sm text-slate-500">Flags for human review, not an automated decision.</p></div><SearchCheck className="text-amber-600" size={22}/></div>
          {!result?<div className="mt-6 flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 text-center"><FileCheck2 size={28} className="mb-3 text-slate-400"/><div className="text-sm font-bold">No report generated</div><p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">Submit the form to view basic completeness checks and review flags.</p></div>:<div className="mt-5 space-y-4"><div className="rounded-xl bg-slate-50 p-4"><div className="text-xs font-bold uppercase tracking-wide text-slate-500">Current status</div><div className="mt-1 text-lg font-extrabold">{result.status}</div><p className="mt-1 text-sm text-slate-500">{result.summary}</p></div><div className="space-y-3">{result.findings.map((f,i)=><div key={i} className="flex gap-3 rounded-xl border border-slate-200 p-3"><div className={`mt-0.5 ${f.severity==="high"?"text-rose-600":f.severity==="medium"?"text-amber-600":"text-emerald-600"}`}>{f.severity==="low"?<CheckCircle2 size={19}/>:<AlertTriangle size={19}/>}</div><div><div className="text-sm font-bold">{f.title}</div><p className="mt-1 text-xs leading-5 text-slate-500">{f.detail}</p><span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[10px] font-extrabold uppercase">{f.severity} priority</span></div></div>)}</div><div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">{result.disclaimer}</div><button type="button" onClick={()=>window.print()} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold"><Download size={16}/> Print / Save report as PDF</button></div>}</div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><h3 className="font-extrabold">Compliance checklist</h3><button onClick={()=>setTab("Compliance checks")} className="text-xs font-bold text-indigo-600">View all</button></div><div className="mt-4 space-y-3">{checks.slice(0,3).map(c=><CheckRow key={c.label} {...c}/>)}</div></div></div>
        </div>}
        {tab==="Compliance checks"&&<div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><h2 className="text-xl font-extrabold">Validation checklist</h2><p className="mt-1 text-sm text-slate-500">Current prototype capabilities vs. planned integrations.</p><div className="mt-6 space-y-3">{checks.map(c=><CheckRow key={c.label} {...c}/>)}</div><div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm leading-6 text-indigo-950"><b>Next phase:</b> OCR extraction, approved regulatory rule sets, authorized issuer checks and anomaly detection need separate implementation, data access and validation.</div></div>}
        {tab==="Audit trail"&&<div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><h2 className="text-xl font-extrabold">Session audit trail</h2><p className="mt-1 text-sm text-slate-500">Local browser-session demo log, not a persistent or tamper-proof production audit system.</p><div className="mt-6 space-y-4">{audit.map((a,i)=><div key={i} className="flex gap-4 border-b border-slate-100 pb-4 last:border-0"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100"><Activity size={17}/></div><div className="flex-1"><div className="text-sm font-bold">{a.action}</div><p className="mt-1 text-xs text-slate-500">{a.detail}</p></div><time className="text-xs text-slate-400">{a.time}</time></div>)}</div></div>}
        {tab==="Institutions"&&<div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><h2 className="text-xl font-extrabold">Institution workspace</h2><p className="mt-1 text-sm text-slate-500">Sample record only; no official AICTE institutional database is connected.</p><div className="mt-6 rounded-xl border border-slate-200 p-4"><div className="text-xs font-bold uppercase text-slate-400">Sample institution</div><div className="mt-2 text-lg font-extrabold">{result?.institution_name||institution}</div><div className="mt-1 text-sm text-slate-500">Reference: {result?.application_id||appId}</div><button onClick={()=>setTab("Application review")} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white">Open application review</button></div></div>}
        <footer className="pb-4 text-center text-xs text-slate-400">VerifyRight AI · SIH26261 prototype · Final decisions remain with competent authorities</footer>
      </section>
    </div>
    <style jsx global>{`.field{margin-top:7px;width:100%;border:1px solid #dbe2ea;border-radius:10px;padding:11px 12px;font-size:14px;outline:none;background:white}.field:focus{border-color:#818cf8;box-shadow:0 0 0 3px rgba(99,102,241,.12)}@media print{aside,form,header button{display:none!important}body{background:white}}`}</style>
  </main>;
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="block text-sm font-semibold text-slate-700">{label}{children}</label>}
function Stat({icon,label,value,tone}:{icon:React.ReactNode;label:string;value:string;tone:string}){const colors:Record<string,string>={indigo:"bg-indigo-50 text-indigo-700",green:"bg-emerald-50 text-emerald-700",amber:"bg-amber-50 text-amber-700",slate:"bg-slate-100 text-slate-700"};return <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className={`rounded-xl p-2.5 ${colors[tone]}`}>{icon}</div><div><div className="text-xs text-slate-500">{label}</div><div className="mt-1 text-sm font-extrabold">{value}</div></div></div>}
function CheckRow({label,detail,done,flag}:{label:string;detail:string;done:boolean;flag:boolean}){return <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4"><div className={`mt-0.5 ${flag?"text-amber-600":done?"text-emerald-600":"text-slate-300"}`}>{flag?<AlertTriangle size={19}/>:done?<CheckCircle2 size={19}/>:<Clock3 size={19}/>}</div><div className="min-w-0 flex-1"><div className="text-sm font-bold">{label}</div><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${flag?"bg-amber-50 text-amber-700":done?"bg-emerald-50 text-emerald-700":"bg-slate-100 text-slate-500"}`}>{flag?"Review":done?"Checked":"Planned"}</span></div>}

import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, KeyRound, UserPlus, ShieldCheck, Trash2, Save } from "lucide-react";
import {
  addAdminUser, changeAdminPassword, listAdminsAndPermissions, updateAdminPermissions,
  adminRevoke,
} from "@/lib/admin.functions";
import { AdminButton, AdminCard, AdminHeading, inputCls, labelCls } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/account")({ component: Page });

type Admin = Awaited<ReturnType<typeof listAdminsAndPermissions>>["admins"][number];
const SECTIONS = ["Dashboard","Bookings","Messages","Website","Identity","Backgrounds","Services","Portfolio","Blog","FAQ","Founder","Media","Settings"];

function Page() {
  return <div className="space-y-8"><AdminHeading title="Account & Access" subtitle="Manage your password, administrator accounts, and access permissions."/><div className="grid gap-6 lg:grid-cols-2"><PasswordCard/><AddAdminCard/></div><PermissionsCard/></div>;
}

function PasswordCard() {
  const fn=useServerFn(changeAdminPassword); const [cur,setCur]=useState(""); const [next,setNext]=useState(""); const [confirm,setConfirm]=useState(""); const [busy,setBusy]=useState(false); const [msg,setMsg]=useState(""); const [err,setErr]=useState("");
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setMsg("");setErr("");if(next.length<6)return setErr("New password must be at least 6 characters.");if(next!==confirm)return setErr("Passwords do not match.");setBusy(true);try{await fn({data:{currentPassword:cur,newPassword:next,confirmPassword:confirm}});setMsg("Password updated successfully.");setCur("");setNext("");setConfirm("");}catch(x){setErr(x instanceof Error?x.message:"Password change failed.");}finally{setBusy(false);}};
  return <AdminCard><div className="flex items-center gap-3"><KeyRound className="h-5 w-5 text-gold"/><div><h3 className="font-display text-lg text-white">Change Password</h3><p className="text-xs text-white/50">Update your current admin password securely.</p></div></div><form onSubmit={submit} className="mt-5 space-y-4"><div><label className={labelCls}>Current password</label><input className={inputCls} type="password" value={cur} onChange={e=>setCur(e.target.value)} required/></div><div><label className={labelCls}>New password</label><input className={inputCls} type="password" minLength={6} value={next} onChange={e=>setNext(e.target.value)} required/></div><div><label className={labelCls}>Confirm password</label><input className={inputCls} type="password" minLength={6} value={confirm} onChange={e=>setConfirm(e.target.value)} required/></div>{err&&<p className="text-sm text-red-300">{err}</p>}{msg&&<p className="text-sm text-emerald-300">{msg}</p>}<AdminButton type="submit" disabled={busy}>{busy?<Loader2 className="h-4 w-4 animate-spin"/>:"Update password"}</AdminButton></form></AdminCard>;
}

function AddAdminCard() {
  const fn=useServerFn(addAdminUser); const [name,setName]=useState("");const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [busy,setBusy]=useState(false);const [msg,setMsg]=useState("");const [err,setErr]=useState("");
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setMsg("");setErr("");setBusy(true);try{const r=await fn({data:{email,password,fullName:name}});setMsg(`Created ${r.email??email}`);setName("");setEmail("");setPassword("");}catch(x){setErr(x instanceof Error?x.message:"Could not create admin.");}finally{setBusy(false);}};
  return <AdminCard><div className="flex items-center gap-3"><UserPlus className="h-5 w-5 text-gold"/><div><h3 className="font-display text-lg text-white">Add Administrator</h3><p className="text-xs text-white/50">Create a separate admin account.</p></div></div><form onSubmit={submit} className="mt-5 space-y-4"><div><label className={labelCls}>Full name</label><input className={inputCls} value={name} onChange={e=>setName(e.target.value)}/></div><div><label className={labelCls}>Email</label><input className={inputCls} type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div><div><label className={labelCls}>Temporary password</label><input className={inputCls} type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required/></div>{err&&<p className="text-sm text-red-300">{err}</p>}{msg&&<p className="text-sm text-emerald-300">{msg}</p>}<AdminButton type="submit" disabled={busy}>{busy?<Loader2 className="h-4 w-4 animate-spin"/>:"Create admin"}</AdminButton></form></AdminCard>;
}

function PermissionsCard(){
 const list=useServerFn(listAdminsAndPermissions), update=useServerFn(updateAdminPermissions), revoke=useServerFn(adminRevoke); const [admins,setAdmins]=useState<Admin[]>([]); const [owner,setOwner]=useState(false); const [busy,setBusy]=useState(false); const [err,setErr]=useState(""); const [saved,setSaved]=useState("");
 const load=useCallback(async()=>{try{const r=await list({});setAdmins(r.admins);setOwner(r.isCallerOwner);}catch(e){setErr(e instanceof Error?e.message:"Could not load administrators.");}},[list]); useEffect(()=>{void load();},[load]);
 const toggle=(id:string,section:string)=>setAdmins(a=>a.map(m=>m.userId===id?{...m,permissions:{...m.permissions,[section]:!m.permissions[section]}}:m));
 const save=async(m:Admin)=>{setBusy(true);setErr("");setSaved("");try{await update({data:{userId:m.userId,permissions:m.permissions}});setSaved(`Permissions saved for ${m.email}`);}catch(e){setErr(e instanceof Error?e.message:"Could not save permissions.");}finally{setBusy(false);}};
 const remove=async(id:string)=>{if(!confirm("Remove admin access from this account?"))return;setBusy(true);try{await revoke({data:{userId:id}});await load();}catch(e){setErr(e instanceof Error?e.message:"Could not remove admin.");}finally{setBusy(false);}};
 return <AdminCard><div className="flex items-center justify-between gap-4"><div><h3 className="font-display text-lg text-white">Administrators & Permissions</h3><p className="text-xs text-white/50">The primary admin controls access for every other administrator.</p></div><ShieldCheck className="h-5 w-5 text-gold"/></div>{!owner&&<p className="mt-4 text-sm text-amber-200">Only the primary admin can change other admins' permissions.</p>}{err&&<p className="mt-4 text-sm text-red-300">{err}</p>}{saved&&<p className="mt-4 text-sm text-emerald-300">{saved}</p>}<div className="mt-6 space-y-6">{admins.map(m=><div key={m.userId} className="rounded-2xl border border-white/10 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-medium text-white">{m.fullName} {m.isOwner&&<span className="ml-2 rounded-full bg-gold/15 px-2 py-1 text-[10px] text-gold">PRIMARY</span>}</p><p className="text-xs text-white/50">{m.email}</p></div>{!m.isOwner&&owner&&<button onClick={()=>void remove(m.userId)} className="text-white/50 hover:text-red-300" title="Remove admin"><Trash2 className="h-4 w-4"/></button>}</div>{!m.isOwner&&<div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{SECTIONS.map(s=><label key={s} className="flex items-center gap-2 rounded-xl border border-white/8 px-3 py-2 text-xs text-white/70"><input type="checkbox" checked={!!m.permissions[s]} onChange={()=>toggle(m.userId,s)} disabled={!owner||busy}/>{s}</label>)}</div>}{!m.isOwner&&<AdminButton className="mt-4" onClick={()=>void save(m)} disabled={!owner||busy}>{busy?<Loader2 className="h-4 w-4 animate-spin"/>:<Save className="h-4 w-4"/>}Save permissions</AdminButton>}</div>)}</div></AdminCard>;
}

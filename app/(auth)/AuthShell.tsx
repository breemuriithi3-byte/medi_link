"use client";
import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <main className="grid min-h-screen place-items-center bg-wash px-6 py-12"><div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-soft"><Link href="/" className="mb-10 flex items-center gap-2 font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-teal text-white"><HeartPulse size={19}/></span>MediLink AI</Link><h1 className="text-3xl font-bold">{title}</h1><p className="mt-2 mb-8 text-slate-500">{subtitle}</p>{children}</div></main>;
}

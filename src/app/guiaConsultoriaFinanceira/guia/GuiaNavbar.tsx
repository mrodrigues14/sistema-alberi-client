"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';

export default function GuiaNavbar(){
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent){
      if(ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  },[]);

  const userName = session?.user?.name || 'Usuário';
  // Exibir sempre 'Aluno Curso' conforme solicitação
  const roleLabel = 'Aluno Curso';

  return (
    <nav className="bg-indigo-700 text-white shadow flex items-center justify-between px-4 h-12">
      <div className="font-semibold tracking-wide text-sm">Guia de Consultoria Financeira</div>
      <div className="relative" ref={ref}>
        <button onClick={() => setOpen(o=>!o)} className="flex items-center gap-2 hover:bg-indigo-600 px-3 py-1 rounded-md text-sm">
          <User size={16} />
          <span className="font-medium max-w-[160px] truncate" title={userName}>{userName}</span>
          <span className="text-[10px] bg-indigo-950/40 px-2 py-0.5 rounded uppercase tracking-wide">{roleLabel}</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-md shadow-lg border border-gray-200 animate-fade-in z-50">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-semibold truncate" title={userName}>{userName}</p>
              <p className="text-xs text-gray-500 truncate" title={roleLabel}>{roleLabel}</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
              <LogOut size={14} /> Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

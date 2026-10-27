import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MailCheck, RefreshCw, LogOut, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const EmailVerificationScreen: React.FC = () => {
  const { currentUser, pendingVerificationEmail, resendVerificationEmail, verifyEmailSimulated, logout, authError } = useAuth();
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const email = currentUser?.email || pendingVerificationEmail || 'usuario@empresa.com';

  const handleResend = async () => {
    setResending(true);
    setResendSuccess(false);
    try {
      await resendVerificationEmail();
      setResendSuccess(true);
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      await verifyEmailSimulated();
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071E13] flex items-center justify-center p-6 text-[#FDFBF7]">
      <div className="max-w-md w-full bg-[#0A2F1D] border border-[#C8A261]/40 p-8 shadow-2xl space-y-6 text-center">
        
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-[#071E13] border border-[#C8A261] mx-auto flex items-center justify-center text-[#C8A261]">
          <MailCheck className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-widest text-[#C8A261] font-semibold">
            Protocolo de Seguridad
          </span>
          <h2 className="text-2xl font-serif text-[#FDFBF7]">
            Verificación de Correo Requerida
          </h2>
          <p className="text-xs text-[#FDFBF7]/75 leading-relaxed font-light">
            Para garantizar la confidencialidad de la información inmobiliaria, el acceso al CRM está bloqueado hasta confirmar la titularidad de su cuenta.
          </p>
        </div>

        {/* Target Email Box */}
        <div className="p-3 bg-[#071E13] border border-[#C8A261]/20 font-mono text-xs text-[#C8A261]">
          {email}
        </div>

        {/* Error or Success feedback */}
        {authError && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 text-left">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{authError}</span>
          </div>
        )}

        {resendSuccess && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 text-left">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Enlace de verificación enviado. Revise su bandeja de entrada o spam.</span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="w-full py-3 px-4 bg-[#C8A261] hover:bg-[#b8914f] text-[#071E13] text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {verifying ? 'Comprobando Verificación...' : 'Confirmar Verificación y Acceder al CRM'}
          </button>

          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full py-2.5 px-4 bg-[#071E13] hover:bg-[#132E22] text-[#FDFBF7] text-xs font-semibold uppercase tracking-wider border border-[#C8A261]/30 transition-colors inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
            <span>{resending ? 'Reenviando...' : 'Reenviar Correo de Verificación'}</span>
          </button>

          <button
            onClick={logout}
            className="w-full py-2 text-xs text-[#FDFBF7]/50 hover:text-[#FDFBF7] transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión / Salir</span>
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, register, resetPassword, authError, clearAuthError, switchUserRoleDemo } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else if (mode === 'register') {
        if (!name.trim()) throw new Error('Por favor indique su nombre completo.');
        await register(name, email, password);
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setForgotSent(true);
      }
    } catch (err) {
      // Error is set in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = (emailPreset: string, rolePreset: 'admin' | 'sales_director' | 'advisor') => {
    switchUserRoleDemo(rolePreset);
  };

  return (
    <div className="min-h-screen bg-[#071E13] flex flex-col justify-center items-center p-6 text-[#FDFBF7]">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-block px-3 py-1 bg-[#0A2F1D] border border-[#C8A261]/40 text-[#C8A261] text-[10px] uppercase font-mono tracking-widest mb-1">
            Plataforma Privada CRM
          </div>
          <h1 className="text-3xl sm:text-4xl font-brand font-bold tracking-widest uppercase text-[#FDFBF7]">
            AUREA
          </h1>
          <p className="text-xs text-[#FDFBF7]/70 font-light tracking-wide">
            Gestión de Cartera Inmobiliaria, Pipeline Comercial & Asesoría Patrimonial
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#0A2F1D] border border-[#C8A261]/35 p-8 shadow-2xl space-y-6">
          
          {/* Header Switcher */}
          <div className="flex border-b border-[#C8A261]/20 pb-3 justify-between items-center text-xs">
            <span className="uppercase tracking-wider font-semibold text-[#C8A261]">
              {mode === 'login' && 'Acceso a Cuenta'}
              {mode === 'register' && 'Registro de Asesor'}
              {mode === 'forgot' && 'Recuperar Contraseña'}
            </span>

            <div className="flex items-center gap-3">
              {mode !== 'login' && (
                <button
                  type="button"
                  onClick={() => { setMode('login'); clearAuthError(); }}
                  className="text-[#FDFBF7]/60 hover:text-[#C8A261] transition-colors"
                >
                  Iniciar Sesión
                </button>
              )}
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => { setMode('register'); clearAuthError(); }}
                  className="text-[#FDFBF7]/60 hover:text-[#C8A261] transition-colors"
                >
                  Crear Cuenta
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="p-3 bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          {forgotSent ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-10 h-10 text-[#C8A261] mx-auto" />
              <h3 className="text-base font-serif text-[#FDFBF7]">Correo de Recuperación Enviado</h3>
              <p className="text-xs text-[#FDFBF7]/75 leading-relaxed font-light">
                Hemos enviado un enlace seguro para restablecer su contraseña a <strong>{email}</strong>.
              </p>
              <button
                type="button"
                onClick={() => { setMode('login'); setForgotSent(false); }}
                className="mt-2 text-xs text-[#C8A261] hover:underline uppercase tracking-wider font-semibold"
              >
                Volver al Inicio de Sesión
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Name (Only in Register mode) */}
              {mode === 'register' && (
                <div>
                  <label className="block uppercase tracking-wider text-[11px] font-semibold text-[#FDFBF7]/80 mb-1.5">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#C8A261] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Rodrigo de la Vega"
                      className="w-full bg-[#071E13] border border-[#C8A261]/30 pl-9 pr-3 py-2.5 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#C8A261]"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block uppercase tracking-wider text-[11px] font-semibold text-[#FDFBF7]/80 mb-1.5">
                  Correo Electrónico Corporativo *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#C8A261] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="asesor@aureahabitat.com"
                    className="w-full bg-[#071E13] border border-[#C8A261]/30 pl-9 pr-3 py-2.5 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#C8A261]"
                  />
                </div>
              </div>

              {/* Password */}
              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="uppercase tracking-wider text-[11px] font-semibold text-[#FDFBF7]/80">
                      Contraseña *
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); clearAuthError(); }}
                        className="text-[11px] text-[#C8A261] hover:underline"
                      >
                        ¿Olvidó su contraseña?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#C8A261] absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-[#071E13] border border-[#C8A261]/30 pl-9 pr-10 py-2.5 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#C8A261]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#FDFBF7]/50 hover:text-[#FDFBF7]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#C8A261] hover:bg-[#b8914f] text-[#071E13] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>
                    {isSubmitting
                      ? 'Procesando...'
                      : mode === 'login'
                      ? 'Ingresar al CRM'
                      : mode === 'register'
                      ? 'Registrar y Enviar Verificación'
                      : 'Enviar Instrucciones'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {mode === 'register' && (
                <p className="text-[11px] text-[#FDFBF7]/60 text-center leading-relaxed mt-2 font-light">
                  Por seguridad, todo nuevo registro inicia con rol de <strong>Asesor</strong> y requiere verificación obligatoria de correo antes de acceder al panel.
                </p>
              )}

            </form>
          )}

        </div>

        {/* Quick Demo Access Switchers */}
        <div className="bg-[#0A2F1D]/60 border border-[#C8A261]/20 p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#C8A261] font-semibold uppercase text-[10px] tracking-wider">
            <span>Acceso de Prueba por Rol (Entorno de Desarrollo)</span>
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('marioalberto2031@gmail.com', 'admin')}
              className="p-2 bg-[#071E13] hover:bg-[#132E22] border border-[#C8A261]/30 text-left transition-colors"
            >
              <div className="font-semibold text-[#FDFBF7] text-[11px]">Carlos Mendoza</div>
              <div className="text-[9px] uppercase text-[#C8A261]">Administrador</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('elena.valdes@aureahabitat.com', 'sales_director')}
              className="p-2 bg-[#071E13] hover:bg-[#132E22] border border-[#C8A261]/30 text-left transition-colors"
            >
              <div className="font-semibold text-[#FDFBF7] text-[11px]">Elena Valdés</div>
              <div className="text-[9px] uppercase text-[#C8A261]">Directora Comercial</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('mateo.rivas@aureahabitat.com', 'advisor')}
              className="p-2 bg-[#071E13] hover:bg-[#132E22] border border-[#C8A261]/30 text-left transition-colors"
            >
              <div className="font-semibold text-[#FDFBF7] text-[11px]">Mateo Rivas</div>
              <div className="text-[9px] uppercase text-[#C8A261]">Asesor Senior</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

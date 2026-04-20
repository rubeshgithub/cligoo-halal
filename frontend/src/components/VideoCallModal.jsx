import React, { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { Video, PhoneOff, Loader2, ShieldCheck, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { useApp } from '../contexts/AppContext';
import client from '../lib/api';

// Keep a single global frame across re-renders / StrictMode double-invocations
let globalFrame = null;

const VideoCallModal = ({ open, onOpenChange, orderId }) => {
  const { lang } = useApp();
  const containerRef = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle | creating | joining | in_call | ended | error
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      cleanup();
      return;
    }
    start();
    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const start = async () => {
    setPhase('creating'); setError('');
    try {
      const { data } = await client.post('/video-calls/create', { order_id: orderId });
      setInfo(data);
      // wait for container mount
      setTimeout(() => joinRoom(data), 100);
    } catch (e) {
      setError(e?.response?.data?.detail || (lang==='fr' ? 'Impossible de démarrer l\'appel.' : 'Unable to start the call.'));
      setPhase('error');
    }
  };

  const joinRoom = async (data) => {
    try {
      // destroy any leftover frame from hot reload / strict mode
      if (globalFrame) {
        try { await globalFrame.destroy(); } catch {}
        globalFrame = null;
      }
      if (!containerRef.current) return;

      if (data.dev_mode) {
        // No real API key yet — show a clear placeholder instead of broken iframe
        setPhase('in_call');
        return;
      }

      setPhase('joining');
      const frame = DailyIframe.createFrame(containerRef.current, {
        iframeStyle: { width: '100%', height: '100%', border: '0', borderRadius: '12px' },
        showLeaveButton: true,
        showFullscreenButton: true,
      });
      globalFrame = frame;

      frame.on('joined-meeting', () => setPhase('in_call'));
      frame.on('left-meeting',   () => { setPhase('ended'); onOpenChange(false); });
      frame.on('error', (ev) => { setError(ev?.errorMsg || 'Call error'); setPhase('error'); });

      await frame.join({ url: data.customer_url });
    } catch (e) {
      setError(e?.message || 'join failed');
      setPhase('error');
    }
  };

  const cleanup = async () => {
    if (globalFrame) {
      try { await globalFrame.leave(); } catch {}
      try { await globalFrame.destroy(); } catch {}
      globalFrame = null;
    }
    if (info?.room_name && !info?.dev_mode) {
      try { await client.post(`/video-calls/end/${info.room_name}`); } catch {}
    }
    setPhase('idle'); setInfo(null); setError('');
  };

  const endAndClose = async () => {
    await cleanup();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v)=>{ if (!v) cleanup(); onOpenChange(v); }}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-[#0F0E0D]">
        <DialogTitle className="sr-only">Video call</DialogTitle>
        <div className="flex items-center justify-between px-4 h-12 bg-[#1F3B40] text-white">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Video className="w-4 h-4 text-[#3E8F8B]" />
            {lang==='fr' ? 'Appel vidéo avec le livreur' : 'Video call with courier'}
            {info?.dev_mode && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-[#F5C7A1] text-[#1F3B40] text-[10px] font-bold">DEMO</span>
            )}
          </div>
          <button onClick={endAndClose} className="h-8 px-3 rounded-full bg-[#E5484D] hover:bg-[#D13B40] text-white text-xs font-semibold inline-flex items-center gap-1">
            <PhoneOff className="w-3.5 h-3.5" /> {lang==='fr' ? 'Raccrocher' : 'Hang up'}
          </button>
        </div>

        <div className="relative aspect-video bg-[#0F0E0D]">
          {phase === 'creating' || phase === 'joining' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
              <Loader2 className="w-10 h-10 animate-spin text-[#3E8F8B]" />
              <p className="text-sm">
                {phase === 'creating' ? (lang==='fr' ? 'Création de la salle sécurisée…' : 'Creating secure room…') : (lang==='fr' ? 'Connexion…' : 'Connecting…')}
              </p>
            </div>
          ) : null}

          {phase === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white px-6 text-center">
              <p className="text-sm text-red-300">{error}</p>
              <button onClick={start} className="h-9 px-4 rounded-full bg-[#3E8F8B] text-white text-sm font-semibold">
                {lang==='fr' ? 'Réessayer' : 'Retry'}
              </button>
            </div>
          )}

          {/* In-call: real frame OR dev fallback UI */}
          <div ref={containerRef} className={`absolute inset-0 ${info?.dev_mode ? 'hidden' : ''}`} />

          {phase === 'in_call' && info?.dev_mode && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white px-8 text-center">
              <div className="w-20 h-20 rounded-full bg-[#3E8F8B]/20 border-2 border-[#3E8F8B] flex items-center justify-center">
                <Video className="w-10 h-10 text-[#3E8F8B]" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">
                  {lang==='fr' ? 'Appel Daily.co — Mode Démo' : 'Daily.co Call — Demo Mode'}
                </h3>
                <p className="text-sm text-white/70 mt-2 max-w-md">
                  {lang==='fr'
                    ? "L'intégration Daily.co est branchée côté backend. Ajoutez votre clé DAILY_API_KEY dans backend/.env pour activer la création de vraies rooms et l'iframe live."
                    : 'Daily.co integration is wired on the backend. Add your DAILY_API_KEY to backend/.env to enable real room creation and live iframe.'}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-left text-xs font-mono text-white/80">
                <div>room: <span className="text-[#F5C7A1]">{info.room_name}</span></div>
                <div>url:  <span className="text-[#F5C7A1] break-all">{info.room_url}</span></div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 text-[11px] text-white/70 bg-[#1F3B40] px-4 py-3 border-t border-white/10">
          <ShieldCheck className="w-3.5 h-3.5 text-[#7BC47F] mt-0.5 shrink-0" />
          <span>
            {lang==='fr'
              ? 'Chiffrement de bout en bout · Room éphémère (expire dans 30 min) · Conforme RGPD.'
              : 'End-to-end encrypted · Ephemeral room (30 min expiry) · GDPR compliant.'}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallModal;

'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { engagements } from '@/data/profile';
import { buildMailtoHref, type ProjectBriefInput } from '@/lib/contact/brief';

type ContactDialogProps = {
  triggerLabel?: string;
  initialService?: string;
  triggerClassName?: string;
};

type BriefErrors = Partial<Record<keyof ProjectBriefInput, string>>;

const emptyBrief: ProjectBriefInput = { name: '', email: '', service: '', summary: '' };

export function ContactDialog({
  triggerLabel = 'Start a project brief',
  initialService = '',
  triggerClassName = 'button',
}: ContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [brief, setBrief] = useState<ProjectBriefInput>({ ...emptyBrief, service: initialService });
  const [errors, setErrors] = useState<BriefErrors>({});
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [website, setWebsite] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    nameRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDialog();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]',
      ));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, initialService]);

  function closeDialog() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function openDialog() {
    setBrief((current) => ({ ...current, service: initialService || current.service }));
    setOpen(true);
  }

  function validate() {
    const nextErrors: BriefErrors = {};
    if (!brief.name.trim()) nextErrors.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.email.trim())) nextErrors.email = 'Enter a valid reply email.';
    if (brief.summary.trim().length < 20) nextErrors.summary = 'Describe the system or decision in at least 20 characters.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    if (sending || !validate()) return;
    setSending(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...brief, website }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setStatus('Could not send. Please try again or use Write via email.');
        return;
      }
      setStatus('Message sent. Thank you — Nabil will reply by email.');
      setBrief({ ...emptyBrief, service: initialService });
    } catch {
      setStatus('Could not send. Please try again or use Write via email.');
    } finally {
      setSending(false);
    }
  }

  function update<K extends keyof ProjectBriefInput>(key: K, value: ProjectBriefInput[K]) {
    setBrief((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  return (
    <>
      <button ref={triggerRef} className={triggerClassName} type="button" onClick={openDialog}>
        {triggerLabel} <span aria-hidden="true">↗</span>
      </button>
      {open ? (
        <div className="contact-modal" role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) closeDialog();
        }}>
          <section ref={dialogRef} className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-dialog-title">
            <div className="contact-dialog__header">
              <div>
                <p className="technical-label">Project brief / contact</p>
                <h2 id="contact-dialog-title">Start a conversation.</h2>
              </div>
              <button type="button" className="dialog-close" onClick={closeDialog} aria-label="Close contact form">×</button>
            </div>
            <p className="contact-dialog__lede">Send your message directly to nabil.rakdani@codehaus.pro, or use your own mail app.</p>
            <form onSubmit={handleSubmit} noValidate>
              <input className="contact-honeypot" aria-hidden="true" tabIndex={-1} autoComplete="off" name="website" value={website} onChange={(event) => setWebsite(event.target.value)} />
              <label>
                <span>Your name</span>
                <input ref={nameRef} maxLength={120} value={brief.name} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} />
                {errors.name ? <small className="field-error">{errors.name}</small> : null}
              </label>
              <label>
                <span>Reply email</span>
                <input type="email" maxLength={254} value={brief.email} onChange={(event) => update('email', event.target.value)} aria-invalid={Boolean(errors.email)} />
                {errors.email ? <small className="field-error">{errors.email}</small> : null}
              </label>
              <label>
                <span>Service <small>(optional)</small></span>
                <select value={brief.service} onChange={(event) => update('service', event.target.value)}>
                  <option value="">Not selected</option>
                  {engagements.map((engagement) => <option key={engagement.id} value={engagement.id}>{engagement.title}</option>)}
                </select>
              </label>
              <label className="contact-summary">
                <span>Task summary</span>
                <textarea rows={5} maxLength={5000} value={brief.summary} onChange={(event) => update('summary', event.target.value)} aria-invalid={Boolean(errors.summary)} />
                {errors.summary ? <small className="field-error">{errors.summary}</small> : null}
              </label>
              <div className="contact-dialog__footer">
                <p>Your details are sent only when you press Send message.</p>
                <button className="button" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send message'} <span aria-hidden="true">↗</span></button>
                <a className="text-link contact-email" href={buildMailtoHref('nabil.rakdani@codehaus.pro', brief)}>Write via email <span aria-hidden="true">↗</span></a>
              </div>
            </form>
            {status ? <p className="contact-status" role="status">{status}</p> : null}
          </section>
        </div>
      ) : null}
    </>
  );
}

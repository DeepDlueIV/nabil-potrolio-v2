'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { engagements, profile } from '@/data/profile';
import { buildMailtoHref, buildProjectBrief, getContactAvailabilityCopy, type ProjectBriefInput } from '@/lib/contact/brief';

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
  const [preparedHref, setPreparedHref] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const contactCopy = getContactAvailabilityCopy(profile.contacts.email);

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
    setPreparedHref('');
    if (!validate()) return;

    if (profile.contacts.email) {
      setPreparedHref(buildMailtoHref(profile.contacts.email, brief));
      setStatus('Email draft prepared. Nothing was sent.');
      return;
    }

    const text = buildProjectBrief(brief);
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Brief copied. Nothing was sent.');
    } catch {
      setStatus('Brief prepared below. Nothing was sent.');
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
                <p className="technical-label">Project brief / local-first</p>
                <h2 id="contact-dialog-title">Start a conversation.</h2>
              </div>
              <button type="button" className="dialog-close" onClick={closeDialog} aria-label="Close contact form">×</button>
            </div>
            <p className="contact-dialog__lede">{contactCopy.dialog}</p>
            <form onSubmit={handleSubmit} noValidate>
              <label>
                <span>Your name</span>
                <input ref={nameRef} value={brief.name} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} />
                {errors.name ? <small className="field-error">{errors.name}</small> : null}
              </label>
              <label>
                <span>Reply email</span>
                <input type="email" value={brief.email} onChange={(event) => update('email', event.target.value)} aria-invalid={Boolean(errors.email)} />
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
                <textarea rows={5} value={brief.summary} onChange={(event) => update('summary', event.target.value)} aria-invalid={Boolean(errors.summary)} />
                {errors.summary ? <small className="field-error">{errors.summary}</small> : null}
              </label>
              <div className="contact-dialog__footer">
                <p>Nothing is transmitted automatically.</p>
                <button className="button" type="submit">Prepare brief <span aria-hidden="true">↗</span></button>
              </div>
            </form>
            {status ? <p className="contact-status" role="status">{status}</p> : null}
            {preparedHref ? <a className="text-link" href={preparedHref}>Open email draft</a> : null}
            {status && !preparedHref ? <pre className="prepared-brief">{buildProjectBrief(brief)}</pre> : null}
          </section>
        </div>
      ) : null}
    </>
  );
}

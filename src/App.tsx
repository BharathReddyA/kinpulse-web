import { FormEvent, useEffect, useRef, useState } from 'react'

type Theme = 'light' | 'dark'

const Icon = ({ name }: { name: 'sun' | 'moon' | 'menu' | 'close' | 'arrow' | 'check' | 'mic' | 'lock' | 'button' }) => {
  const paths: Record<string, React.ReactNode> = {
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>, close: <path d="m6 6 12 12M18 6 6 18"/>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5"/>, check: <path d="m5 12 4 4L19 6"/>,
    mic: <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    button: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></>,
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function App() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('kinpulse-theme') as Theme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  const [menuOpen, setMenuOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('kinpulse-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#101714' : '#f2eee5')
  }, [theme])

  useEffect(() => {
    const go = (hash: string) => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      history.replaceState(null, '', `${location.pathname}${location.search}`)
    }
    const click = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!link || event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      event.preventDefault(); go(link.hash); setMenuOpen(false)
    }
    document.addEventListener('click', click)
    if (location.hash) requestAnimationFrame(() => go(location.hash))
    return () => document.removeEventListener('click', click)
  }, [])

  useEffect(() => {
    if (!formOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector<HTMLInputElement>('input')?.focus()
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setFormOpen(false) }
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', closeOnEscape) }
  }, [formOpen])

  const openForm = () => { setFormStatus('idle'); setFormOpen(true) }

  const submitApplication = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormStatus('sending')
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const response = await fetch('https://formsubmit.co/ajax/bharath.alluri@outlook.com', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _subject: 'New Kinpulse founding pilot application', _template: 'table' }),
      })
      if (!response.ok) throw new Error('Submission failed')
      form.reset(); setFormStatus('sent')
    } catch { setFormStatus('error') }
  }

  return <>
    <a className="skip" href="#main">Skip to content</a>
    <header>
      <a className="wordmark" href="#top" aria-label="Kinpulse home"><span className="wave"><i/><i/><i/></span>kinpulse</a>
      <nav className={menuOpen ? 'open' : ''} aria-label="Primary navigation">
        <a href="#morning">One morning</a><a href="#device">The device</a><a href="#principles">Our principles</a><a href="#pilot">The pilot</a>
      </nav>
        <div className="header-tools">
        <button className="round" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}><Icon name={theme === 'dark' ? 'sun' : 'moon'}/></button>
          <button className="header-cta" onClick={openForm}>Join the pilot</button>
        <button className="round menu" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open menu'}><Icon name={menuOpen ? 'close' : 'menu'}/></button>
      </div>
    </header>

    <main id="main">
      <section className="hero" id="top">
        <img src="/images/kinpulse-morning-hero.png" alt="Kinpulse voice device beside a coffee cup on a sunlit kitchen counter" />
        <div className="hero-shade"/>
        <div className="hero-copy"><p className="overline">A voice check-in for families living apart</p><h1>A small check-in.<br/><em>A little more<br/>peace of mind.</em></h1><p>Kinpulse starts one gentle conversation each day, listens for what matters, and lets your family know how things are going.</p><div><button className="button" onClick={openForm}>Apply for the pilot <Icon name="arrow"/></button><a className="plain-link" href="#morning">See one morning ↓</a></div></div>
        <p className="concept-label">Concept image · Product in development</p>
      </section>

      <section className="intro"><p>Made for the ordinary space between<br/><strong>“I should call”</strong> and <strong>“Is everything okay?”</strong></p><span>Kinpulse is not a replacement for family contact. It helps you know when a real conversation may matter.</span></section>

      <section className="morning section" id="morning">
        <div className="section-lead"><span>01 — ONE MORNING</span><h2>It starts like<br/>a familiar conversation.</h2><p>No commands to memorize. No screen to navigate. Just a few questions at a time your parent chooses.</p></div>
        <div className="conversation">
          <div className="time"><span>9:08</span><i/></div>
          <div className="speech device-speech"><small>KINPULSE</small><p>Good morning, Maria.<br/>How are you feeling today?</p></div>
          <div className="speech parent-speech"><small>MARIA</small><p>Pretty good. I already took my medication.</p></div>
          <div className="speech device-speech last"><small>KINPULSE</small><p>Glad to hear it. Anything you’d like your family to know?</p></div>
          <div className="listening"><span className="wave"><i/><i/><i/></span> Listening only during this check-in</div>
        </div>
      </section>

      <section className="signal section">
        <div className="phone" aria-label="Example family check-in summary">
          <div className="phone-bar"><span>9:12</span><span>● ● ●</span></div><p className="app-name">KINPULSE</p><p className="today">Today</p>
          <div className="person"><span>M</span><div><h3>Mom checked in</h3><p>9:08 AM · 4 minutes</p></div></div>
          <div className="result"><p><span><Icon name="check"/></span>Medication <strong>Reported taken</strong></p><p><span>☺</span>Mood <strong>Positive</strong></p><p><span>—</span>Concerns <strong>None mentioned</strong></p></div>
          <div className="phone-note"><small>A GENTLE NUDGE</small><p>Things feel normal today. It has been four days since your last call.</p><button>Call Mom</button></div>
        </div>
        <div className="signal-copy"><span>02 — WHAT THE FAMILY SEES</span><h2>You don’t need<br/>every detail.</h2><p>You want to know whether today feels normal. Kinpulse shares a concise summary—not a private transcript—and never presents a reported answer as verified medical fact.</p><blockquote>“One quiet day may mean nothing. Three different days in a row may be worth a call.”</blockquote></div>
      </section>

      <section className="device-story" id="device">
        <div className="device-image"><img src="/images/kinpulse-morning-hero.png" alt="Close view of the Kinpulse device, showing its visible status light and tactile button"/></div>
        <div className="device-copy"><span>03 — DESIGNED TO BE UNDERSTOOD</span><h2>No hidden state.<br/>No mystery listening.</h2><p>The product should explain itself from across the room. A light shows when audio is active. One physical button gives the parent a clear choice.</p>
          <div className="detail"><Icon name="mic"/><div><h3>The microphone is never hidden</h3><p>Its status is visible. Audio leaves the device only during an active check-in.</p></div></div>
          <div className="detail"><Icon name="button"/><div><h3>“Not today” is a real answer</h3><p>Pressing the amber button declines a check-in without creating a false emergency.</p></div></div>
          <div className="detail"><Icon name="lock"/><div><h3>Less information, held carefully</h3><p>Families receive useful signals. Raw conversations are not kept as a family archive.</p></div></div>
        </div>
      </section>

      <section className="principles section" id="principles"><p className="overline">THE PRODUCT PROMISE</p><h2>Four decisions we won’t quietly undo.</h2><div className="rules">
        <article><b>01</b><h3>There will never be a camera.</h3><p>Not as an add-on. Not as a premium feature.</p></article>
        <article><b>02</b><h3>Consent continues after setup.</h3><p>A parent can pause, decline, or stop using Kinpulse.</p></article>
        <article><b>03</b><h3>A signal is not a diagnosis.</h3><p>We describe what was reported and what changed—nothing more.</p></article>
        <article><b>04</b><h3>Kinpulse will not pretend to be emergency care.</h3><p>It supports family awareness. It cannot guarantee someone is safe.</p></article>
      </div><div className="privacy-line"><Icon name="lock"/><p><strong>Designed around sensitive-data safeguards.</strong> Encryption, limited access, data minimization, deletion controls, and documented consent are part of the product—not a badge added afterward. Regulatory applicability and compliance will be independently reviewed before launch.</p></div></section>

      <section className="founder section"><div><span>WHY WE’RE BUILDING THIS</span><h2>The call you meant to make shouldn’t become a source of guilt.</h2></div><div><p>Families are busy. Parents value independence. Both can be true without leaving everyone guessing.</p><p>Kinpulse began with a narrow idea: create a small daily ritual that serves the parent first and gives the family just enough context to show up at the right moment.</p><p className="signed">— The Kinpulse founding idea</p></div></section>

      <section className="pilot" id="pilot"><div className="pilot-card"><p className="overline">FOUNDING PILOT · 20 FAMILIES</p><h2>Help us test whether this deserves to exist.</h2><p>We’re preparing a small household pilot. We want families who will tell us what feels useful, what feels intrusive, and what needs to change.</p><ul><li><Icon name="check"/> One parent living independently</li><li><Icon name="check"/> One participating family circle</li><li><Icon name="check"/> Regular feedback for 8 weeks</li></ul><button className="button light" onClick={openForm}>Apply for the founding pilot <Icon name="arrow"/></button><small>No payment today. No promise of selection. We’ll contact interested families before the pilot begins.</small></div></section>
    </main>

    {formOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false) }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="pilot-form-title" ref={dialogRef}>
        <button className="modal-close" onClick={() => setFormOpen(false)} aria-label="Close application form"><Icon name="close"/></button>
        {formStatus === 'sent' ? <div className="form-success"><span><Icon name="check"/></span><p className="overline">APPLICATION RECEIVED</p><h2>Thank you for trusting us with your story.</h2><p>Your details have been sent to the Kinpulse team. We’ll be in touch before pilot selection begins.</p><button className="button light" onClick={() => setFormOpen(false)}>Close</button></div> : <>
          <p className="overline">FOUNDING PILOT · 20 FAMILIES</p><h2 id="pilot-form-title">Tell us a little about your family.</h2><p className="modal-intro">This is an expression of interest—not a medical intake or commitment to participate.</p>
          <form onSubmit={submitApplication}>
            <div className="form-grid"><label>Full name<input name="name" autoComplete="name" required/></label><label>Email address<input name="email" type="email" autoComplete="email" required/></label><label>Phone <span>(optional)</span><input name="phone" type="tel" autoComplete="tel"/></label><label>Your relationship to the parent<select name="relationship" required defaultValue=""><option value="" disabled>Select one</option><option>Adult child</option><option>Spouse or partner</option><option>Sibling</option><option>Friend or other caregiver</option></select></label><label>Parent’s city or region <span>(no street address)</span><input name="parent_region" autoComplete="off" required/></label><label>Parent’s living situation<select name="living_situation" required defaultValue=""><option value="" disabled>Select one</option><option>Lives independently alone</option><option>Lives independently with someone</option><option>Independent or assisted community</option><option>Other</option></select></label></div>
            <label>What would you hope Kinpulse helps with?<textarea name="hopes" rows={4} required placeholder="A short, non-medical description is enough."/></label>
            <label className="consent"><input type="checkbox" name="contact_consent" value="Yes" required/><span>I agree that Kinpulse may email me about this pilot. I understand this form is processed by a third-party email delivery service and should not include medical records or urgent information.</span></label>
            {formStatus === 'error' && <p className="form-error" role="alert">We couldn’t send the application. Please try again or email bharath.alluri@outlook.com.</p>}
            <button className="button light submit" type="submit" disabled={formStatus === 'sending'}>{formStatus === 'sending' ? 'Sending…' : 'Send pilot application'} <Icon name="arrow"/></button>
          </form>
        </>}
      </div>
    </div>}

    <footer><div><a className="wordmark" href="#top"><span className="wave"><i/><i/><i/></span>kinpulse</a><p>Connection without surveillance.</p></div><div><a href="#principles">Privacy principles</a><a href="mailto:hello@kinpulse.com">Contact</a><a href="#pilot">Pilot</a></div><p>© {new Date().getFullYear()} Kinpulse · Concept product · Not an emergency or medical service</p></footer>
  </>
}

export default App

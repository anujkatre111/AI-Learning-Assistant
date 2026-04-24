import { Link } from 'react-router-dom'
import Silk from '../background/Silk'

/* ── Media placeholder — swap with <img> or <video> ── */
function MediaBox({ label = 'Video / Screenshot' }) {
  return (
    <div
      className="w-full rounded-md flex items-center justify-center"
      style={{
        aspectRatio: '16/9',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <span className="text-white/15 text-[9px] tracking-widest uppercase">{label}</span>
    </div>
  )
}

export default function Landingpage() {
  return (
    <div
      className="relative min-h-screen"
      style={{ fontFamily: "'Sora', 'DM Sans', sans-serif", background: '#0c0418' }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');`}</style>

      {/* ── SILK BACKGROUND ── */}
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <Silk
          speed={5}
          scale={1}
          color="#00bd81"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      {/* ── PAGE CONTENT ── */}
      <div className="relative" style={{ zIndex: 1 }}>

        {/* NAV */}
        <nav className="flex justify-center pt-5 px-6">
          <div
            className="flex items-center justify-between w-full max-w-3xl px-5 py-2"
            style={{
              background: 'rgba(255,255,255,0.055)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 12,
              backdropFilter: 'blur(18px)',
            }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="3" fill="#c4b5fd"/>
                <circle cx="10" cy="3"  r="1.4" fill="#c4b5fd" opacity=".5"/>
                <circle cx="10" cy="17" r="1.4" fill="#c4b5fd" opacity=".5"/>
                <circle cx="3"  cy="10" r="1.4" fill="#c4b5fd" opacity=".5"/>
                <circle cx="17" cy="10" r="1.4" fill="#c4b5fd" opacity=".5"/>
              </svg>
              <span className="text-white text-sm font-semibold tracking-tight">Lumina</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-5">
              <a href="#how"      className="text-white/45 text-xs hover:text-white/75 transition-colors">How it works</a>
              <a href="#features" className="text-white/45 text-xs hover:text-white/75 transition-colors">Features</a>
            </div>

            {/* Auth */}
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-white/45 text-xs px-3 py-1.5 hover:text-white/70 transition-colors">
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold px-4 py-1.5 bg-white text-black hover:bg-white/90 transition-colors"
                style={{ borderRadius: 7 }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="flex flex-col items-center text-center pt-28 pb-20 px-6">
          {/* Badge */}
          <div
            className="flex items-center gap-2 mb-7 px-3 py-1"
            style={{
              background: 'rgba(0,0,0,0.45)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 100,
            }}
          >
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 text-black"
              style={{ background: 'white', borderRadius: 4 }}
            >
              NEW
            </span>
            <span className="text-white/50 text-[11px]">Personalised AI tutoring, now live</span>
          </div>

          <h1
            className="text-white font-bold leading-[1.07] mb-4"
            style={{
              fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)',
              letterSpacing: '-0.03em',
              maxWidth: 740,
            }}
          >
            Learn anything, faster —<br />with an AI that actually teaches.
          </h1>

          <p className="text-white/40 text-sm leading-relaxed mb-9" style={{ maxWidth: 400 }}>
            Lumina adapts to how you think, explains concepts visually,
            and tests real understanding — not just memory.
          </p>

          <div className="flex items-center gap-2.5">
            <Link
              to="/register"
              className="text-sm font-semibold px-5 py-2.5 bg-white text-black hover:bg-white/90 transition-all"
              style={{ borderRadius: 7 }}
            >
              Get started free
            </Link>
            <a
              href="#how"
              className="text-sm text-white/60 hover:text-white/80 px-5 py-2.5 transition-colors"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 7,
              }}
            >
              See how it works
            </a>
          </div>

          <p className="mt-5 text-white/20 text-[11px] tracking-wide">
            Free plan available · No credit card needed
          </p>
        </section>

        {/* HERO MEDIA */}
        <div className="px-6 mb-24 flex justify-center">
          <div className="w-full max-w-4xl">
            <iframe
              src="https://player.cloudinary.com/embed/?cloud_name=dbxnzwkgi&public_id=Screen_Recording_2026-04-24_at_12.51.51_PM_e5joix&profile=cld-default"
              width="640"
              height="360"
              style={{
                height: 'auto',
                width: '100%',
                aspectRatio: '640 / 360',
                borderRadius: '0.375rem',
              }}
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              frameBorder="0"
              title="Lumina product demo video"
            />
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section id="how" className="px-6 pb-24 max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-violet-400 text-[10px] tracking-widest uppercase mb-2">How it works</p>
            <h2
              className="text-white font-bold leading-tight"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', letterSpacing: '-0.025em' }}
            >
              Three steps to actually learning from your documents.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: 1,
                title: 'Upload your PDF',
                desc: 'Drop in any document — NCERT chapters, competitive exam material, research papers, course notes. Lumina reads and understands it instantly.',
              },
              {
                num: 2,
                title: 'Chat to understand',
                desc: 'Ask anything about your document. Lumina pulls the most relevant parts and explains concepts in plain language — like a tutor who has read your exact material.',
              },
              {
                num: 3,
                title: 'Test what you\'ve learned',
                desc: 'Generate flashcards for quick revision or take a quiz tailored to your document. Active recall, not passive reading.',
              },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col gap-3">
                {/* Swap this MediaBox with your actual <img> or <video> */}
                
                <div>
                  <span className="text-[10px] tracking-widest text-violet-400 uppercase">Step {num}</span>
                  <h3 className="text-white text-sm font-semibold mt-0.5 mb-1">{title}</h3>
                  <p className="text-white/65 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="px-6 pb-24 max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-violet-400 text-[10px] tracking-widest uppercase mb-2">Features</p>
            <h2
              className="text-white font-bold leading-tight"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', letterSpacing: '-0.025em' }}
            >
              Built for real learning, not just reading.
            </h2>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-px"
            style={{
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            {[
              { icon: '◎', title: 'Chat with your document',    desc: 'Ask questions, clear doubts, go deep on any concept — Lumina answers using only your PDF, so every response is accurate and relevant to what you\'re studying.' },
              { icon: '▦', title: 'AI flashcard generator',     desc: 'Instantly turn any PDF into a set of flashcards built around the most important concepts. No manual effort, no missed topics.' },
              { icon: '⌘', title: 'Smart quiz generator',       desc: 'Auto-generated MCQs and short-answer questions based on your document — designed to test application and exam-readiness, not just definitions.' },
              { icon: '◷', title: 'RAG-powered accuracy',       desc: 'Every answer is grounded in your uploaded document using Retrieval Augmented Generation — so Lumina never hallucinates or goes off-topic.' },
            ].map((f) => (
              <div key={f.title} className="p-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="text-violet-400 text-base mb-3 block">{f.icon}</span>
                <h3 className="text-white text-sm font-semibold mb-1.5">{f.title}</h3>
                <p className="text-white/65 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="px-6 pb-20 flex flex-col items-center text-center">
          <h2
            className="text-white font-bold leading-tight mb-6"
            style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.6rem)', letterSpacing: '-0.025em', maxWidth: 520 }}
          >
            Start learning the way you were meant to.
          </h2>
          <Link
            to="/register"
            className="text-sm font-semibold px-6 py-2.5 bg-white text-black hover:bg-white/90 transition-all"
            style={{ borderRadius: 7 }}
          >
            Create free account
          </Link>
        </section>

        {/* FOOTER */}
        <footer
          className="flex items-center justify-between px-10 py-4 text-[11px]"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-1.5 text-white/25">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" fill="#c4b5fd" opacity=".4"/>
              <circle cx="10" cy="3"  r="1.4" fill="#c4b5fd" opacity=".25"/>
              <circle cx="10" cy="17" r="1.4" fill="#c4b5fd" opacity=".25"/>
              <circle cx="3"  cy="10" r="1.4" fill="#c4b5fd" opacity=".25"/>
              <circle cx="17" cy="10" r="1.4" fill="#c4b5fd" opacity=".25"/>
            </svg>
            Lumina AI
          </div>
          <span className="text-white/20">© {new Date().getFullYear()} · All rights reserved</span>
        </footer>

      </div>
    </div>
  )
}
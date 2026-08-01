import React from 'react';
import { Link } from 'react-router-dom';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

export default function About() {
  return (
    <div className="min-h-screen text-[#E2DED0]">
      <SiteNav />

      <main className="max-w-2xl mx-auto px-8 pt-32 pb-24">
        <div className="text-center mb-16">
          <div className="label-caps text-[9px] tracking-[0.3em]" style={{ color: '#3F8A66' }}>
            About the Asklepieion
          </div>
          <h1 className="font-heading font-light mt-3" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)' }}>
            Why This Exists
          </h1>
        </div>

        <div
          style={{ fontFamily: 'Source Serif 4, Georgia, serif', color: '#C6BFB0', fontSize: '1.04rem', lineHeight: '1.9' }}
          className="space-y-6"
        >
          <p>
            Most textbooks summarise. That is not a criticism — it is what a
            textbook is for, and it is usually the right call for someone
            trying to cover a curriculum in a semester. But summary was never
            enough for the kind of reading medicine actually rewards: the
            anatomy that only makes sense once you understand the physiology
            sitting on top of it, the biochemistry that explains why a
            disease behaves the way it does, the pathology that ties the
            whole thing back to a patient in front of you. That connective
            reading exists, but it is scattered — a paragraph in one book, a
            diagram in another, a paper nobody assigns. Gathering it is its
            own separate skill, one nobody really teaches, and it is hardest
            exactly when you can least afford it: in first year, arriving
            from sixth form with no real practice at the kind of independent
            reading a medical degree demands.
          </p>
          <p>
            The Asklepieion is an attempt to do that gathering once,
            properly, and leave the result somewhere anyone can use it. It is
            organised the way the ancient healing sanctuaries were laid out —
            a Hall for anatomy, one for physiology, one for biochemistry, one
            for histopathology, and a Propylon, a gate, for ethics, since
            that is not a subject finished once and left behind but a
            threshold crossed into every one of the others. Inside each Hall,
            Chapters, and inside each Chapter, Tablets: individual essays
            written to the depth a physician would actually want, not the
            depth an exam demands.
          </p>
          <p>
            This is being built gradually, alongside my own medical studies,
            one Tablet at a time — not a finished reference but a working
            one. If you are a doctor reading this: the project exists
            precisely so that people with real clinical experience can check
            it, correct it, and tell me where a first year's understanding of
            a topic still has real gaps. That scrutiny is the whole point,
            not an afterthought.
          </p>
        </div>

        <div className="w-16 h-px mx-auto my-16" style={{ background: '#2A2620' }} />

        <div className="text-center mb-10">
          <div className="label-caps text-[9px] tracking-[0.3em]" style={{ color: '#3F8A66' }}>
            The Author
          </div>
          <h2 className="font-heading font-light mt-3" style={{ fontSize: '1.6rem' }}>
            Ἀσκληπιάδης
          </h2>
        </div>

        {/* ===================================================================
            EDIT THIS BLOCK before the site goes properly public.
            Everything in brackets below is a placeholder, not a guess — none
            of it is invented, it's deliberately left for you to fill in.
           =================================================================== */}
        <p
          style={{ fontFamily: 'Source Serif 4, Georgia, serif', color: '#C6BFB0', fontSize: '1.02rem', lineHeight: '1.9' }}
        >
          [Your name] is a [year of study, e.g. "third-year"] medical student
          at [institution — optional, leave this out entirely if you'd rather
          not name it]. [A sentence or two on your own background, particular
          interests within medicine, or why this project matters to you —
          replace this whole placeholder paragraph with your own words.]
        </p>
        {/* =================================================================== */}

        <p className="mt-14 text-center">
          <Link to="/archive" className="label-caps text-[9px] tracking-[0.2em]" style={{ color: '#3F8A66' }}>
            Browse the Archive →
          </Link>
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}

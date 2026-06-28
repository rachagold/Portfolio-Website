import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export function USShopComingSoon() {
  return (
    <div className="us-editorial">

      {/* ── Masthead ──────────────────────────────────────────────── */}
      <motion.header
        className="us-masthead"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
      >
        <span className="us-masthead__eyebrow">United States</span>
        <span className="us-masthead__rule" aria-hidden="true" />
        <span className="us-masthead__year">2027</span>
      </motion.header>

      {/* ── Hero strip: wide image + overlaid headline ────────────── */}
      <motion.div
        className="us-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.1 }}
      >
        <img
          src="/images/products/Russian Market/Russian Market - All.png"
          alt=""
          className="us-hero__img"
          draggable={false}
        />
        <div className="us-hero__overlay">
          <h1 className="us-hero__headline">
            US Merch Availability Paused
          </h1>
          <p className="us-hero__sub">Returning Summer 2027</p>
        </div>
      </motion.div>

      {/* ── Row A: text statement | portrait image ────────────────── */}
      <div className="us-row-a">
        <motion.div
          className="us-row-a__text"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="us-row-a__statement">
            Currently&nbsp;creating
            <br />
            in&nbsp;Cambodia—
          </p>
          <p className="us-row-a__continue">
            US&nbsp;orders&nbsp;will&nbsp;reopen
            <br />
            next&nbsp;summer.
          </p>
        </motion.div>

        <motion.div
          className="us-row-a__img-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.1 }}
        >
          <img
            src="/images/products/Koh Rong EP/Koh Rong EP - Tee white 2.png"
            alt=""
            className="us-row-a__img"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* ── Three-up flush image strip ────────────────────────────── */}
      <div className="us-strip">
        {[
          '/images/products/Jeju/Jeju - Tote Beige.png',
          '/images/products/Phnom Penh/Phnom Penh - Print 2.png',
          '/images/products/Russian Market/Russian Market - Tote beige.png',
        ].map((src, i) => (
          <motion.div
            key={src}
            className="us-strip__cell"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <img src={src} alt="" className="us-strip__img" draggable={false} />
          </motion.div>
        ))}
      </div>

      {/* ── Row B: image with bold text overlay | tall portrait ───── */}
      <div className="us-row-b">
        <motion.div
          className="us-row-b__overlay-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
        >
          <img
            src="/images/products/Phnom Penh/Phnom Penh - Tee White.png"
            alt=""
            className="us-row-b__img"
            draggable={false}
          />
          <div className="us-row-b__caption">
            <span className="us-row-b__caption-text">Rachel Goldberg Art</span>
          </div>
        </motion.div>

        <motion.div
          className="us-row-b__portrait-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.1 }}
        >
          <img
            src="/images/products/Jeju/Jeju - Tee Beige.png"
            alt=""
            className="us-row-b__img"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* ── Inquiry strip ─────────────────────────────────────────── */}
      <motion.div
        className="us-inquiry"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="us-inquiry__inner">
          <span className="us-inquiry__label">Inquiries</span>
          <p className="us-inquiry__body">
            For special inquiries, custom commissions, or questions,{' '}
            please reach out via my{' '}
            <Link to="/contact" className="us-inquiry__link">
              contact page
            </Link>
            .
          </p>
        </div>

        <div className="us-inquiry__img-wrap">
          <img
            src="/images/products/Koh Rong EP/Koh Rong EP - Postcard.png"
            alt=""
            className="us-inquiry__img"
            draggable={false}
          />
        </div>
      </motion.div>

      {/* ── Footer colophon ───────────────────────────────────────── */}
      <motion.footer
        className="us-colophon"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="us-colophon__name">Rachel Goldberg Art</span>
        <span className="us-colophon__sep" aria-hidden="true">—</span>
        <Link to="/contact" className="us-colophon__link">Contact</Link>
        <span className="us-colophon__sep" aria-hidden="true">—</span>
        <a
          href="https://instagram.com/rachagold.art"
          target="_blank"
          rel="noopener noreferrer"
          className="us-colophon__link"
        >
          @rachagold.art
        </a>
      </motion.footer>

    </div>
  );
}

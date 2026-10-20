import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './AboutPage.css';

const values = [
  {
    title: 'Simplicity In Design',
    description: "No flashy logos, no senseless details, just the world's most comfortable shoes, made naturally and designed practically. It's that simple.",
  },
  {
    title: 'Confidence in Comfort',
    description: "Trying is believing. Give our shoes a shot for 30 days and if you're not walking on cloud nine, we'll take them back—no questions asked.",
  },
  {
    title: 'Made from Nature',
    description: "The footwear industry often overlooks Mother Nature's materials in favor of cheaper, synthetic alternatives. We think it's time to change that.",
  },
];

export default function AboutPage({ setCurrentPage }) {
  return (
    <div className="about-page">
      <div className="about-page-container">
        <button
          type="button"
          className="about-back-button"
          onClick={() => setCurrentPage('home')}
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        <div className="about-side-art">
          <span className="about-side-art-backdrop" aria-hidden="true" />
          <img src="/media/about.jpg" alt="StepUp footwear collection" />
        </div>

        <section className="about-intro" aria-labelledby="about-title">
          <h1 id="about-title">About StepUp</h1>
          <p>
            StepUp is India's largest sports and athleisure footwear brand. Incorporated in 2006,
            StepUp Activewear is one of the leading players in organized sports &amp; casual footwear
            sector in India. Since 2016, the flagship brand 'StepUp', has been the largest sports and
            athleisure footwear brand in India, in both volume and value terms. The company's products
            are available via an expansive Pan-India network of over 15,000 geo-tagged multi-brand
            retail stores, 35+ company-owned exclusive outlets, large format stores such as Walmart,
            Vishal Retail and Reliance Smart among others and all the leading e-commerce portals.
          </p>
        </section>

        <section className="about-mission" aria-labelledby="mission-title">
          <h2 id="mission-title">Our Mission</h2>
          <p>
            At StepUp we craft shoes with care for everyone- men, women and kids, with an equal
            attention to detail, letting each shoe speak for itself. The world-class quality, trendy
            designs and affordable prices have captured the imagination of millions of people, across
            the country- making StepUp, an inspirational brand especially for- young adults, everyday
            performers and fashionistas.
          </p>
          <div
            className="about-mission-image"
          >
            <img src="/media/aboutcenter.jpg" alt="Blue and pink children's shoes" />
          </div>
        </section>

        <section className="about-values" aria-label="What StepUp stands for">
          {values.map((value) => (
            <article className="about-value" key={value.title}>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

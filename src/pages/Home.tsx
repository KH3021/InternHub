import React from 'react';
import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import FeaturedJobs from '../components/home/FeaturedJobs';
import FeaturedInternships from '../components/home/FeaturedInternships';
import TopCompanies from '../components/home/TopCompanies';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Statistics from '../components/home/Statistics';
import CTA from '../components/home/CTA';

export default function Home() {
  return (
    <div className="space-y-0">
      <Hero />
      <Categories />
      <FeaturedJobs />
      <FeaturedInternships />
      <TopCompanies />
      <WhyChooseUs />
      <Statistics />
      <CTA />
    </div>
  );
}

import React from 'react'
import Dreamjob from '../LandingPage/Dreamjob';
import Companies from '../LandingPage/Companies';
import JobCategory from '../LandingPage/JobCategory';
import Working from '../LandingPage/Working';
import Testinomials from '../LandingPage/Testinomials';
import Subscribe from '../LandingPage/Subscribe';


function Homepage() {
  return (
    <div className='min-h-screen w-full bg-mine-shaft-950 font-["poppins"] overflow-x-hidden'>
      <Dreamjob />
      <Companies />
      <JobCategory />
      <Working />
      <Testinomials />
      <Subscribe />
    </div>
  )
}

export default Homepage;
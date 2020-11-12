import React from 'react';
import PropTypes from 'prop-types';
import Contacts from '../contacts/Contacts';

const Home = () => {
  return (
    <div className='grid-2'>
      <div>{/* contactForm */}</div>
      <div>
        <Contacts />
      </div>
    </div>
  );
};

Home.propTypes = {};

export default Home;

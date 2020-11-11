import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ContactContext from '../../context/contact/contactContext';

const Home = () => {
  const contactContext = useContext(ContactContext);

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

Home.propTypes = {};

export default Home;

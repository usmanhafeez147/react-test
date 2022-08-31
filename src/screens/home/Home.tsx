import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'antd';

import ProductListing from '../../components/ProductListing'

// import './Home.less';

type Props = {};

const Home: React.FC<Props> = () => {

  return (
    <>
      <ProductListing />
    </>
  );
};

export default Home;

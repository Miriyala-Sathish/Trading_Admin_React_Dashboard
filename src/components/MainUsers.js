import { useState } from 'react';
import MainUsersBanner from './MainUsers/MainUsersbanner';

import MainUserTable from './MainUsers/MainUserTable';

const MainUsers = () => {


  return (
    <section className="main-users">
    
     <MainUsersBanner />

   <MainUserTable />
    </section>
  );
};

export default MainUsers;
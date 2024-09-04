'use client';
import Banner from '@/components/Banner/Banner';
import ChooseVehicle from '@/components/ChooseVehicle/ChooseVehicle';
import Why from '@/components/Why/Why';
import Workflow from '@/components/Workflow/Workflow';
import dynamic from 'next/dynamic';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Home() {
  return (
    <main>
      <Banner />
      <ChooseVehicle />
      <Workflow />
      <Why />
    </main>
  );
}

export default Home;

import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';
import Models from '@/components/models/models';

const ModelsPage: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Models"
        description="List of models for use at native"
      />
      <Models />
    </>
  );
};

ModelsPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default ModelsPage;

import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';
import { useLayout } from '@/lib/hooks/use-layout';
import CreateDocument from '@/components/documents/create-documents';

const CreateDocumentPage: NextPageWithLayout = () => {
  const { layout } = useLayout();
  // render retro layout
  return (
    <>
      <NextSeo
         title="Documents"
         description="Native - Documents"
       />
      <CreateDocument />
    </>
  );
};

CreateDocumentPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default CreateDocumentPage;

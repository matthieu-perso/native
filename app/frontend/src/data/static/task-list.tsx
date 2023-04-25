import AuthorImage from '@/assets/images/author.jpg';
import NFT1 from '@/assets/images/nft/nft-1.jpg';
import NFT2 from '@/assets/images/nft/nft-2.jpg';
import NFT3 from '@/assets/images/nft/nft-3.jpg';
import NFT4 from '@/assets/images/nft/nft-4.jpg';

export const TaskList = [
  {
    id: 1,
    author: 'native',
    description: "Ask questions to a set of documents ",
    name: 'Question & Answer',
    model: 'Text',
    link: 'tasks/qa'
  },
  {
    id: 2,
    author: 'native',
    description: "Generates an image based on the text you enter.",
    name: 'Text to Image',
    model: 'Image',
    link: 'tasks/qa'

  },
  {
    id: 3,
    author: 'native',
    description: "Generates an image based on text and a reference image.",
    name: 'Controled Text to Image ',
    model: 'Text, Image',
    link: 'tasks/qa'

  }
];

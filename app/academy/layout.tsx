import type {Metadata} from 'next';
const title='Free Typing Lessons for Beginners | TypeSprint';
const description='Learn touch typing in eight stages, from the home row to words, capitals, numbers and punctuation. Practice finger placement and build typing accuracy.';
export const metadata:Metadata={title,description,alternates:{canonical:'/academy'},openGraph:{title,description,url:'/academy'}};
export default function Layout({children}:{children:React.ReactNode}){return children;}

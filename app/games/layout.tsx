import type {Metadata} from 'next';
const title='Free Typing Games — Racing and Shadow Battle | TypeSprint';
const description='Practice typing through arcade car racing and Shadow Battle. Turn accurate words into game actions and choose your difficulty.';
export const metadata:Metadata={title,description,alternates:{canonical:'/games'},openGraph:{title,description,url:'/games'}};
export default function Layout({children}:{children:React.ReactNode}){return children;}

import type {Metadata} from 'next';
const title='Story Typing Practice — Original Stories | TypeSprint';
const description='Practice typing complete sentences with original stories. Build accuracy and a steady rhythm as you read and type.';
export const metadata:Metadata={title,description,alternates:{canonical:'/stories'},openGraph:{title,description,url:'/stories'}};
export default function Layout({children}:{children:React.ReactNode}){return children;}

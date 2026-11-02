import type {Metadata} from 'next';
import TypingTestGuide from '@/components/TypingTestGuide';
const title='Free Typing Speed Test — Check Your WPM | TypeSprint';
const description='Test your typing speed and accuracy with free 15-second, 30-second, 1-minute and 2-minute WPM tests. No account needed. Practice with words and sentences.';
export const metadata:Metadata={title,description,alternates:{canonical:'/practice'},openGraph:{title,description,url:'/practice'}};
export default function Layout({children}:{children:React.ReactNode}){return <>{children}<div className="workspace"><TypingTestGuide/></div></>;}

export const modes=['Common words','Sentences','Numbers','Punctuation','Accuracy practice'];
export {practiceText as passage} from './typing-passages';
export const lessons=[
 {title:'Meet your keyboard',hint:'Sit comfortably. Rest your index fingers on the raised F and J keys. Use your thumbs for space.',text:'fff jjj f j f j ff jj fj fj'},
 {title:'Find your home row',hint:'Left fingers rest on A S D F; right fingers on J K L ;. Return home after every key.',text:'asdf jkl; asdf jkl; sad fad lass fall ask dad'},
 {title:'Reach for the top',hint:'Reach upward from home: left Q W E R T, right Y U I O P. Keep your wrists relaxed.',text:'qwer tyui op quiet power type write we peer'},
 {title:'Explore the bottom row',hint:'Curl fingers down to Z X C V B and N M. Move one finger, then return to home.',text:'zxcv bnm zoom mix calm cabin vivid brave'},
 {title:'Make every space count',hint:'Tap space with a thumb. Think in complete words while maintaining a relaxed rhythm.',text:'the small bird rests on a quiet branch in the warm sun'},
 {title:'Add expression',hint:'Hold Shift with the opposite pinky for capitals. Use the number row and punctuation deliberately.',text:'Hello, Sam! Pack 2 pens, 3 books, and 5 maps.'},
 {title:'Build a steady rhythm',hint:'Read a few characters ahead. Aim for accuracy first; speed grows with a consistent rhythm.',text:'A little practice each day makes difficult things feel natural.'},
 {title:'Your graduation sprint',hint:'Bring everything together. Finish with at least 95% accuracy to graduate.',text:'Today, I begin a new chapter. With 10 calm breaths, steady hands, and daily practice, I can improve!'}
];
export type Result={id:string;date:string;mode:string;duration:number;wpm:number;accuracy:number;errors:number};
export function read<T>(key:string,fallback:T):T{try{return JSON.parse(localStorage.getItem(key)??'null')??fallback;}catch{return fallback;}}
export function save(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}

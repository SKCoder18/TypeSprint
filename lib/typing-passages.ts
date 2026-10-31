import {stories,storyText} from './stories';
// Finite passages: each source paragraph appears once, never padded or looped.
export function narrativeText(seed=0){const originals=stories.filter(s=>s.kind==='Original fiction');const index=((seed%originals.length)+originals.length)%originals.length;return [...originals.slice(index),...originals.slice(0,index)].map(storyText).join(' ');}
export function practiceText(mode:number,seed=0){if(mode===2){return Array.from({length:1800},(_,i)=>String(101+(seed*1800+i)*7)).join(' ');}const text=narrativeText(seed);if(mode===0)return text.toLowerCase().replace(/[^a-z ]/g,'').replace(/ +/g,' ');if(mode===4)return text.toLowerCase();return text;}
export function gameText(difficulty:'Easy'|'Medium'|'Hard'){const text=narrativeText(difficulty==='Easy'?6:difficulty==='Medium'?0:5);return difficulty==='Hard'?text:text.toLowerCase().replace(/[^a-z ]/g,'').replace(/ +/g,' ');}

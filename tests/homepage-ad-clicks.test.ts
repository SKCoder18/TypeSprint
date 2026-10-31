import {test} from 'node:test';
import assert from 'node:assert/strict';
import {countHomepageClick, type HomepageClick} from '../lib/advertising/homepage-clicks';
const click: HomepageClick = {pathname:'/',enabled:true,consent:true,privacyRestricted:false,trusted:true,button:0,modified:false};
function memory() {const data=new Map<string,string>(); return {getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);}};}
test('homepage opportunities occur on clicks 1, 6, 11 and 16 only',()=>{
  const store=memory(), opportunities:number[]=[];
  for(let i=1;i<=20;i++) if(countHomepageClick(store,click).opportunity) opportunities.push(i);
  assert.deepEqual(opportunities,[1,6,11,16]);
});
test('all other routes neither trigger nor advance the sequence',()=>{
  const store=memory();
  for(const pathname of ['/practice','/stories','/academy','/games','/games/racing','/shadow','/racing','/rhythm','/youtube','/video-challenge','/online-racing','/account','/about'])
    assert.deepEqual(countHomepageClick(store,{...click,pathname}),{counted:false,opportunity:false});
  assert.equal(countHomepageClick(store,click).opportunity,true);
  for(let i=0;i<4;i++) assert.equal(countHomepageClick(store,click).opportunity,false);
  assert.equal(countHomepageClick(store,click).opportunity,true);
});
test('disabled, denied consent, privacy signals, synthetic and modified clicks are ignored',()=>{
  const store=memory();
  for(const change of [{enabled:false},{consent:false},{privacyRestricted:true},{trusted:false},{button:1},{modified:true}])
    assert.equal(countHomepageClick(store,{...click,...change}).counted,false);
  assert.equal(countHomepageClick(store,click).opportunity,true);
});
test('unavailable, corrupt and overflowing storage declines',()=>{
  const broken={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};
  assert.equal(countHomepageClick(broken,click).opportunity,false);
  for(const value of ['NaN','-1','1.5','9007199254740991'])
    assert.equal(countHomepageClick({getItem:()=>value,setItem(){}},click).opportunity,false);
  assert.equal(countHomepageClick({getItem:()=>null,setItem(){throw Error('full');}},click).opportunity,false);
});

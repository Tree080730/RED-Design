import { useState } from 'react';
import { ArrowUpOutlined, LeftOutlined, DownOutlined } from '@ant-design/icons';

type Props={onKey:(key:string)=>void;onDone:()=>void;onDismiss:()=>void;onReveal:()=>void};
export function SimulatedKeyboard({onKey,onDone,onDismiss,onReveal}:Props){
 const [shift,setShift]=useState(false);const [numbers,setNumbers]=useState(false);
 const rows=numbers?['1234567890','-/:;()$&@','.,?!\'']:['qwertyuiop','asdfghjkl','zxcvbnm'];
 return <section className="sim-keyboard" aria-label="Simulated keyboard" onPointerDown={e=>e.preventDefault()} onAnimationEnd={onReveal}>
  <div className="sim-keyboard-bar"><span>English · Preview keyboard</span><button type="button" aria-label="Hide keyboard" onClick={onDismiss}><DownOutlined/></button></div>
  {rows.map((row,index)=><div className={`sim-key-row sim-key-row-${index}`} key={index}>{index===2&&<button className="sim-key-function" type="button" aria-label="Shift" aria-pressed={shift} disabled={numbers} onClick={()=>setShift(v=>!v)}><ArrowUpOutlined/></button>}{[...row].map(char=><button type="button" key={char} aria-label={`Type ${shift?char.toUpperCase():char}`} onClick={()=>{onKey(shift?char.toUpperCase():char);setShift(false);}}>{shift?char.toUpperCase():char}</button>)}{index===2&&<button className="sim-key-function" type="button" aria-label="Delete character" onClick={()=>onKey('Backspace')}><LeftOutlined/></button>}</div>)}
  <div className="sim-key-row"><button className="sim-key-function" type="button" onClick={()=>setNumbers(v=>!v)}>{numbers?'ABC':'123'}</button><button className="sim-key-space" type="button" aria-label="Space" onClick={()=>onKey(' ')}>space</button><button className="sim-key-done" type="button" onClick={onDone}>Done</button></div>
 </section>;
}

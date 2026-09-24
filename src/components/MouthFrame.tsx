import { CustomTeeth, CustomTongue, useMouthConfig } from './MouthConfig';
import type { CSSProperties } from 'react';
// Decorative vector mouth; interactive controls remain normal accessible HTML.
export function MouthFrame({className=''}:{className?:string}={}){
 const {config}=useMouthConfig();
 return <div className={`mouth-frame-art nose-${config.nose}${className?` ${className}`:''}`} aria-hidden="true" style={{'--mouth-interior':config.insideColor,'--nose-scale':config.noseSize/100} as CSSProperties}>
  <div className="mouth-frame-cavity"><div className="mouth-frame-interior">
   <svg className="mouth-frame-teeth" viewBox="0 0 200 50" preserveAspectRatio="none" focusable="false"><CustomTeeth x={0} y={0} width={200} height={16}/></svg>
   <svg className="mouth-frame-tongue" viewBox="0 0 200 40" preserveAspectRatio="none" focusable="false"><CustomTongue x={0} y={0} width={200} height={40}/></svg>
  </div></div>
 </div>;
}

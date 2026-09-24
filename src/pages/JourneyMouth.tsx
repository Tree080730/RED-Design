import { CustomNose, CustomTeeth, useMouthConfig } from '../components/MouthConfig';

// A single vector face morphs between the two approved compositions.
export function JourneyMouth({progress,chewing,result,droolOpacity,closure,chewWave,successProgress=0}:{progress:number;chewing:boolean;result:'yes'|'no'|null;droolOpacity:number;closure:number;chewWave:number;successProgress?:number}){
 const {config}=useMouthConfig();
 const n=(a:number,b:number)=>a+(b-a)*progress;
 const x=(v:number)=>54.27+v*.53356;
 const y=(v:number)=>498.18+v*.53356;
 const rect=(initial:number[],final:number[])=>({x:n(x(initial[0]),final[0]),y:n(y(initial[1]),final[1]),width:n(initial[2]*.53356,final[2]),height:n(initial[3]*.53356,final[3]),rx:n(initial[4]*.53356,final[4])});
 const cavity=rect([65,42,420,212,106],[-37.52,603.5,477.04,259.3,107.2]);
 const top=n(y(74),643.4),bottom=n(y(222),823.3);
 const tongueStart=[252,222,266,177,319,170,355,195,394,172,442,178,455,222];
 const tongueEnd=[173.1,823.3,181.7,775,251.4,756.2,298,792.7,344.7,756.2,414.3,775,422.9,823.3];
 const t=tongueStart.map((v,i)=>n(i%2?y(v):x(v),tongueEnd[i]));
 const closed=(chewing||result)?closure*(1-successProgress):0;
 const pulse=chewWave*closed;
 const mouthY=674-4*pulse;
 return <svg className="journey-face" viewBox="0 0 402 874" preserveAspectRatio="none" role="img" aria-label={result==='yes'?'Satisfied mouth':result==='no'?'Unhappy mouth':chewing?'Mouth chewing':'An eager mouth ready to try food'}>
  <defs>
   <clipPath id="journey-cavity"><rect {...cavity}/></clipPath>
   <clipPath id="journey-smile-clip"><path d="M92 620H310C345 620 366 646 366 678C366 742 319 786 257 786H145C83 786 36 742 36 678C36 646 57 620 92 620Z"/></clipPath>
   <clipPath id="journey-sick-clip"><path d="M22.5 900V665C22.5 627 49 597 86 597H317C354 597 380.5 627 380.5 665V900Z"/></clipPath>
   <clipPath id="journey-stream-clip"><path d="M22.5 684H380.5V920H22.5Z"/></clipPath>
  </defs>
  <g fill="#FDDECB">
   <rect {...rect([40,20,470,260,130],[-53.6,576.6,509.2,311.9,112.56])}/>
   <g opacity={1-progress}><rect {...rect([0,142,80,52,26],[-96,720,44,28,14])}/><rect {...rect([470,142,80,52,26],[455,720,44,28,14])}/></g>
   <CustomNose x={n(x(252),172.6)} y={n(y(0),554)} width={n(44*.53356,53.6)} height={n(42*.53356,38.6)}/>
   <ellipse className="journey-cheek" opacity={closed} cx={368+7*pulse} cy={635-14*pulse} rx={54+8*pulse} ry={64+5*pulse}/>
  </g>
  <g className={`journey-mouth-opening ${chewing?'is-chewing':''} ${result?`result-${result}`:''}`} opacity={result?0:1-closed} style={{transformOrigin:`201px ${n(y(148),730)}px`,transform:result?undefined:`translateY(${-56*closed}px) scaleY(${1-.96*closed})`}}>
   <g clipPath="url(#journey-cavity)">
    <rect {...cavity} fill="#FFFFFF"/>
    <path fill={config.insideColor} d={`M${cavity.x} ${top}H${cavity.x+cavity.width}V${bottom}H${cavity.x}Z`}/>
    <CustomTeeth x={cavity.x} y={top} width={cavity.width} height={18}/>
    <path fill={config.tongueColor} d={`M${t[0]} ${t[1]}C${t.slice(2,8).join(' ')}C${t.slice(8).join(' ')}Z`}/>
   </g>
  </g>
  {result==='yes'&&<g className="journey-happy-mouth" opacity={successProgress} transform={`translate(0 ${674*(1-(.06+.94*successProgress))}) scale(1 ${.06+.94*successProgress})`}>
   {/* Match the mouth bounds in the 750×1624 page reference. */}
   <g className="journey-smile-size" transform="translate(200 692) scale(1.147 1.151) translate(-201 -703)">
   <g clipPath="url(#journey-smile-clip)">
    <path fill={config.insideColor} d="M30 615H372V800H30Z"/>
    <path className="journey-smile-teeth" fill="#FFFFFF" d="M30 615H372V645H30Z"/>
    <CustomTeeth x={30} y={615} width={342} height={30}/>
    <path className="journey-smile-tongue" fill={config.tongueColor} d="M183 761C190 729 231 718 263 741C295 718 336 729 344 761Z"/>
    <path className="journey-smile-lower-teeth" fill="#FFFFFF" d="M30 761H372V800H30Z"/>
   </g>
   </g>
  </g>}
  {result==='no'&&<g className="journey-sick-mouth" opacity={successProgress} transform={`translate(0 ${674*(1-(.06+.94*successProgress))}) scale(1 ${.06+.94*successProgress})`}>
   <g clipPath="url(#journey-sick-clip)">
    <path fill={config.insideColor} d="M22.5 597H380.5V900H22.5Z"/>
    <path fill="#FFFFFF" d="M22.5 597H380.5V632H22.5Z"/>
    <g className="journey-sick-stream" style={{transformOrigin:'201px 684px',transform:`scaleY(${successProgress})`}}>
     <path fill="#C6CE7C" d="M22.5 684H380.5V980H22.5Z"/>
     <g clipPath="url(#journey-stream-clip)">
      <path fill="#BDC870" d="M57 684H86L78 920H50ZM269 684H291L304 920H275Z"/>
      <g transform="translate(0 684)">
       <g className="journey-waterfall-lines" fill="none" stroke="#DCE39D" strokeWidth="5" strokeLinecap="round">
        {[-200,0,200].map(offset=><g key={offset} transform={`translate(0 ${offset})`}>
         <path d="M43 12Q39 33 43 56M104 86Q108 113 104 145M175 24Q170 49 175 73M244 126Q249 152 244 176M335 49Q330 82 335 106M366 155V187"/>
        </g>)}
       </g>
       <g className="journey-sick-particles">
        {[-200,0,200].map(offset=><g key={offset} transform={`translate(0 ${offset})`}>
         <g fill="none" stroke="#B98A45" strokeWidth="7" strokeLinecap="round"><path d="M149 47L147 53M58 89L63 100M249 135L241 145"/></g>
         <g fill="#E15B5E"><circle cx="219" cy="61" r="4.3"/><circle cx="111" cy="117" r="4.3"/><circle cx="310" cy="143" r="4.3"/></g>
        </g>)}
       </g>
      </g>
      <g className="journey-foam-back" fill="#ADC779">
       <path className="journey-foam" style={{animationDuration:'2900ms',animationDelay:'-800ms'}} d="M0 849C5 829 25 823 40 830C41 801 79 795 94 816C115 805 143 819 143 841C168 826 198 844 200 868V920H0Z"/>
       <path className="journey-foam" style={{animationDuration:'3600ms',animationDelay:'-1900ms'}} d="M163 870C160 846 180 829 201 835C203 812 224 802 244 815C252 780 300 785 307 817C331 801 360 817 360 839C380 827 400 840 408 858V920H163Z"/>
      </g>
      <g className="journey-foam-front" fill="#DCE7A2">
       <path className="journey-foam" style={{animationDuration:'2400ms',animationDelay:'-1500ms'}} d="M0 887C1 864 23 850 45 856C53 827 89 825 101 849C123 836 151 849 153 871C176 861 196 878 195 898V925H0Z"/>
       <path className="journey-foam" style={{animationDuration:'3100ms',animationDelay:'-300ms'}} d="M155 906C154 881 177 865 199 873C204 850 234 839 253 858C272 844 301 849 311 872C322 835 368 833 382 863C403 857 418 873 423 895V925H155Z"/>
      </g>
     </g>
    </g>
   </g>
  </g>}
  <g className="journey-closed-mouth" opacity={closed} fill="none" stroke={config.insideColor} strokeLinecap="round" strokeLinejoin="round" style={{transformOrigin:'201px 674px',transform:`translateY(${-3*pulse}px) scaleY(${1+.12*pulse})`}}>
   <path strokeWidth="12" d={`M60 ${mouthY} C97 ${650+5*pulse} 120 ${648-3*pulse} 153 ${661+4*pulse} S199 ${678-5*pulse} 230 ${664-3*pulse} S284 ${647+5*pulse} 326 ${mouthY}`}/>
   <path strokeWidth="12" d={`M337 ${644-5*pulse} Q${322-3*pulse} ${mouthY} 337 ${703-3*pulse}`}/>
  </g>
  <g opacity={droolOpacity} transform="translate(54.27 498.18) scale(.53356)">
   <g fill="#79BFFF" transform="translate(446 222)">
    <path className="confirm-drool-strand" d="M-9 0H9V91H-9Z"/>
    <g className="confirm-drool-drop"><circle className="confirm-drool-bead" r="21"/></g>
   </g>
  </g>
 </svg>;
}

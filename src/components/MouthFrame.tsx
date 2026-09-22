// Decorative vector mouth; interactive controls remain normal accessible HTML.
export function MouthFrame(){
 return <div className="mouth-frame-art" aria-hidden="true">
  <div className="mouth-frame-cavity"><div className="mouth-frame-interior">
   <svg className="mouth-frame-tongue" viewBox="0 0 200 40" preserveAspectRatio="none" focusable="false"><path fill="#D76568" d="M0 40C12 0 62 -10 100 16C138 -10 188 0 200 40Z"/></svg>
  </div></div>
 </div>;
}

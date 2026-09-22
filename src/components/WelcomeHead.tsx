import { useState, type PointerEvent } from 'react';
import './welcome-head.css';

// Reference geometry is authored as separate vector parts, not an embedded image.
export function WelcomeHead() {
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [greeting, setGreeting] = useState(0);
  function follow(event: PointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setLook({ x: (event.clientX - rect.left - rect.width / 2) / rect.width * 7,
      y: (event.clientY - rect.top - rect.height / 2) / rect.height * 5 });
  }
  return <button className="welcome-head" type="button" aria-label="Animate your character"
    onPointerMove={follow} onPointerLeave={() => setLook({ x: 0, y: 0 })}
    onClick={() => setGreeting(value => value + 1)}>
    <svg viewBox="0 -68 478 458" aria-hidden="true" focusable="false">
      <g className="welcome-head-float">
        <g key={greeting} className={greeting ? 'welcome-head-greeting' : undefined}>
          <g fill="#FDDECB" className="welcome-head-face">
            <g transform="translate(0 -44.23)">
              <path d="M45 243C23 245 8 257 9 279C9 299 23 320 44 323C58 326 73 315 83 303L68 250Z"/>
              <path d="M430 243C454 245 470 258 470 279C470 300 454 320 435 323C421 325 407 316 394 304L409 248Z"/>
            </g>
            <path d="M237 0C125 0 35 87 35 191C35 296 122 382 237 382C350 382 440 296 440 192C440 85 350 0 237 0Z"/>
          </g>
          <g transform="translate(0 6)">
            <g className="welcome-head-eyes">
              <rect x="141" y="43" width="88" height="113" rx="44" fill="#FFFFFF"/>
              <rect x="244" y="43" width="88" height="113" rx="44" fill="#FFFFFF"/>
              <g className="welcome-head-pupils" transform={`translate(${look.x} ${look.y})`}>
                <rect x="169.5" y="62" width="60" height="75" rx="30" fill="#3D3D3D"/>
                <rect x="243.5" y="62" width="60" height="75" rx="30" fill="#3D3D3D"/>
                <rect x="180" y="78" width="9" height="14" rx="4.5" fill="#FFFFFF"/>
                <rect x="254" y="78" width="9" height="14" rx="4.5" fill="#FFFFFF"/>
              </g>
            </g>
            <ellipse cx="238" cy="154" rx="12" ry="8.5" fill="#DFA18F"/>
          </g>
          <path className="welcome-head-mouth" transform="translate(-11.9 0) scale(1.05 1.07)" d="M82 221C82 185 100 159 128 159C158 159 193 176 238 176C283 176 318 159 348 159C376 159 394 185 394 221C394 291 324 342 238 342C152 342 82 291 82 221Z" fill="#930600"/>
          <g className="welcome-head-hair" fill="#49302B">
            <path d="M35 198.77C27 86 113 -12 237 -12C361 -12 448 86 440 198.77C434 194.77 430 181.77 427 166.77C422 118 401 80 370 58C353 46 337 37 320 31C288 45 248 42 216 25C178 42 135 42 104 66C72 91 53 128 47 168.77C44 184.77 40 195.77 35 198.77Z"/>
          </g>
        </g>
      </g>
    </svg>
  </button>;
}

import { type CSSProperties, type ReactNode } from 'react';
import { theme } from 'antd';
import { palette } from './theme';

// Consumers use these aliases, never a second manually copied token scale.
export function TokenProvider({ children }: { children: ReactNode }) {
  const { token: t } = theme.useToken();
  const vars: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(t)) {
    if (typeof value !== 'string' && typeof value !== 'number') continue;
    const unitless = /^(lineHeight|fontWeight|opacity|zIndex|motion)/.test(key) || key === 'sizeUnit' || key === 'sizeStep';
    vars[`--ds-${key}`] = typeof value === 'number' && !unitless ? `${value}px` : value;
  }
  Object.entries(palette).forEach(([name,value]) => { vars[`--brand-${name}`] = value; });
  return <div className="ds-root" style={vars as CSSProperties}>{children}</div>;
}

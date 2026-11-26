import { _tpl, _slot, scope, type CompiledTemplate, type SlotView } from '@fierst/aster';

/** Standard Lucide child element tuple (`['path', { d: '...' }]`). */
export type LucideIconNode = readonly [
  tag: string,
  attrs: Readonly<Record<string, string | number | undefined>>,
  children?: readonly LucideIconNode[],
];

/** Standard `@lucide/icons` v1.x tree-shakeable icon data object. */
export interface LucideIconData {
  readonly name?: string;
  readonly node: readonly LucideIconNode[];
  readonly aliases?: readonly string[];
  readonly size?: number;
  readonly width?: number;
  readonly height?: number;
}

/** Accepts either `@lucide/icons` `LucideIconData` or legacy `lucide` / `@lucide/lab` `LucideIconNode[]`. */
export type LucideIconInput = LucideIconData | readonly LucideIconNode[];

const iconScope = scope`
  :scope {
    display: inline-block;
    vertical-align: middle;
    flex-shrink: 0;
  }
  :scope.is-spin {
    animation: aster-icon-spin 0.8s linear infinite;
  }
  @keyframes aster-icon-spin {
    to { transform: rotate(360deg); }
  }
`;

const ALLOWED_SVG_TAGS = new Set([
  'path',
  'circle',
  'rect',
  'line',
  'polyline',
  'polygon',
  'ellipse',
]);

function escapeAttr(val: string | number): string {
  return String(val)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function renderIconNodes(nodes: readonly LucideIconNode[]): string {
  let out = '';
  for (const [tag, attrs, children] of nodes) {
    if (!ALLOWED_SVG_TAGS.has(tag)) continue;
    let attrStr = '';
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || k === 'key') continue;
      attrStr += ` ${k}="${escapeAttr(v)}"`;
    }
    const inner = children && children.length > 0 ? renderIconNodes(children) : '';
    out += `<${tag}${attrStr}>${inner}</${tag}>`;
  }
  return out;
}

const templateCache = new WeakMap<object, CompiledTemplate>();

function getIconTemplate(input: LucideIconInput): CompiledTemplate {
  let cached = templateCache.get(input as object);
  if (cached) return cached;

  const isDataObj = !Array.isArray(input);
  const nodes: readonly LucideIconNode[] = isDataObj ? (input as LucideIconData).node : input;
  const vbW = isDataObj
    ? ((input as LucideIconData).width ?? (input as LucideIconData).size ?? 24)
    : 24;
  const vbH = isDataObj
    ? ((input as LucideIconData).height ?? (input as LucideIconData).size ?? 24)
    : 24;

  let inner = renderIconNodes(nodes);
  for (const [tag, attrs] of nodes) {
    if (!ALLOWED_SVG_TAGS.has(tag)) continue;
    let attrStr = '';
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || k === 'key') continue;
      attrStr += ` ${k}="${escapeAttr(v)}"`;
    }
    inner += `<${tag}${attrStr}></${tag}>`;
  }

  const html =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}" ` +
    `fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" ` +
    `data-aster-a0="">${inner}</svg>`;

  cached = _tpl(html, [{ kind: 'spread', path: [0] }]);
  templateCache.set(input as object, cached);
  return cached;
}

export interface IconProps {
  /** Tree-shaken icon imported from `@lucide/icons` (or a `LucideIconNode[]` tuple array). */
  icon: LucideIconInput;
  /** Icon width & height in px or CSS length (default: 18). */
  size?: number | string;
  /** SVG stroke width (default: 1.75 for AsterUI optical balance). */
  strokeWidth?: number;
  /** Scale stroke width inversely with `size` so lines stay visually consistent at any scale. */
  absoluteStrokeWidth?: boolean;
  /** Override stroke color (defaults to `currentColor`). */
  color?: string;
  /** Animate continuous rotation (ideal for `LoaderCircle`). */
  spin?: boolean;
  /** Accessible label. When omitted, the icon is treated as decorative (`aria-hidden="true"`). */
  label?: string;
  class?: string;
  [key: string]: any;
}

/**
 * AsterUI Lucide Icon component — zero-runtime-overhead Slot-Compiled SVG.
 * Works identically in Client DOM, Shadow DOM Web Components, and SSR.
 *
 * @example
 *   import { Search } from '@lucide/icons';
 *   <Icon icon={Search} size={16} />
 */
export function Icon({
  icon,
  size = 18,
  strokeWidth = 1.75,
  absoluteStrokeWidth = false,
  color,
  spin = false,
  label,
  class: extraClass,
  ...rest
}: IconProps): SlotView {
  const tpl = getIconTemplate(icon);
  const iconName = !Array.isArray(icon) ? (icon as LucideIconData).name : undefined;
  const numericSize = typeof size === 'number' ? size : Number.parseFloat(size) || 24;
  const computedStroke = absoluteStrokeWidth ? (strokeWidth * 24) / numericSize : strokeWidth;

  const hasLabel = Boolean(label || rest['aria-label']);
  const cls = [
    iconScope,
    'lucide',
    iconName ? `lucide-${iconName}` : '',
    spin ? 'is-spin' : '',
    extraClass,
  ]
    .filter(Boolean)
    .join(' ');

  const svgAttrs: Record<string, any> = {
    ...rest,
    width: size,
    height: size,
    'stroke-width': computedStroke,
    class: cls,
  };

  if (color) svgAttrs.stroke = color;
  if (hasLabel) {
    svgAttrs.role = rest.role ?? 'img';
    if (label) svgAttrs['aria-label'] = label;
  } else {
    svgAttrs['aria-hidden'] = true;
    svgAttrs.focusable = 'false';
  }

  return _slot(tpl, [svgAttrs]);
}

/** Create a dedicated stateless icon component from any `@lucide/icons` export. */
export function createIcon(
  icon: LucideIconInput,
  defaults: Omit<IconProps, 'icon'> = {},
): (props?: Omit<IconProps, 'icon'>) => SlotView {
  return (props = {}) => Icon({ ...defaults, ...props, icon });
}

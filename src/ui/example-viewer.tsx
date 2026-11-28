import './theme.css';
import { scope, type Ctx, type View } from '@fierst/aster';
import { CodeBlock } from './copy-button';
import { SegmentedControl } from './segmented-control';

const viewerScope = scope`
  :scope { min-width:0; border:1px solid var(--aster-border); border-radius:var(--aster-radius-lg); color:var(--aster-on-surface); background:var(--aster-surface); }
  .toolbar { display:flex; align-items:center; justify-content:space-between; gap:.75rem; flex-wrap:wrap; padding:.75rem 1rem; border-bottom:1px solid var(--aster-border); }
  .panel { min-width:0; padding:1rem; }
  .panel > * + * { margin-top:.75rem; }
`;
const modes = [
  { value: 'example', label: 'Example' },
  { value: 'source', label: 'Source' },
];

export function* ExampleViewer(
  props: {
    title: string;
    children: View;
    files: readonly { filename: string; code: string }[];
  },
  ctx: Ctx,
) {
  let mode = 'example';
  for (props of ctx) {
    yield (
      <section class={viewerScope} aria-label={props.title}>
        <div class="toolbar">
          <strong>{props.title}</strong>
          <SegmentedControl
            label={props.title + ' view'}
            options={modes}
            value={mode}
            onChange={(value) => {
              mode = value;
              ctx.refresh();
            }}
          />
        </div>
        <div class="panel" hidden={mode !== 'example'}>
          {props.children}
        </div>
        <div class="panel" hidden={mode !== 'source'}>
          {props.files.map((file) => (
            <CodeBlock key={file.filename} filename={file.filename} code={file.code} />
          ))}
        </div>
      </section>
    );
  }
}

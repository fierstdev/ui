import './theme.css';
import { FileText, UploadCloud, X } from '@lucide/icons';
import { scope, type Ctx } from '@fierst/aster';
import { Icon } from './icon';

const fuScope = scope`
  :scope {
    display: grid;
    gap: 0.65rem;
    font-family: var(--aster-font-sans);
  }
  .fu-label { font-size: 0.84rem; font-weight: 500; color: var(--aster-on-surface); }
  .dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    padding: 1.5rem 1rem;
    border-radius: var(--aster-radius-lg);
    border: 1.5px dashed var(--aster-border-strong);
    background: var(--aster-surface);
    color: var(--aster-on-surface-muted);
    text-align: center;
    cursor: pointer;
    transition:
      border-color var(--aster-dur-fast),
      background-color var(--aster-dur-fast);
  }
  .dropzone:hover,
  .dropzone.is-dragover {
    border-color: var(--aster-primary);
    background: var(--aster-primary-subtle);
  }
  .dz-icon {
    width: 38px;
    height: 38px;
    border-radius: var(--aster-radius-md);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    color: var(--aster-on-surface);
    display: inline-grid;
    place-items: center;
    box-shadow: var(--aster-shadow-xs);
  }
  .dz-title { font-size: 0.875rem; font-weight: 500; color: var(--aster-on-surface); }
  .dz-sub { font-size: 0.78rem; color: var(--aster-on-surface-muted); }
  .native-file { position: absolute; width: 1px; height: 1px; clip-path: inset(50%); overflow: hidden; }
  .dropzone:focus-within { outline: 2px solid var(--aster-primary); outline-offset: 2px; }
  .fu-error { font-size: 0.78rem; color: var(--aster-danger); font-weight: 500; }
  .file-list { display: grid; gap: 0.4rem; }
  .file-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.65rem;
    padding: 0.5rem 0.75rem;
    border-radius: var(--aster-radius-md);
    border: 1px solid var(--aster-border);
    background: var(--aster-surface);
    font-size: 0.82rem;
  }
  .file-meta { display: flex; align-items: center; gap: 0.5rem; min-width: 0; }
  .file-name { font-weight: 500; color: var(--aster-on-surface); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .file-size { color: var(--aster-on-surface-subtle); font-family: var(--aster-font-mono); font-size: 0.74rem; flex-shrink: 0; }
  .file-rm {
    border: none;
    background: transparent;
    color: var(--aster-on-surface-muted);
    cursor: pointer;
    padding: 0.2rem;
    border-radius: var(--aster-radius-xs);
    display: inline-grid;
    place-items: center;
  }
  .file-rm:hover { background: var(--aster-surface-muted); color: var(--aster-on-surface); }
`;

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

let fuSeq = 0;

export function* FileUpload(
  props: {
    label?: string;
    accept?: string;
    multiple?: boolean;
    maxSizeBytes?: number;
    hint?: string;
    onChange?: (files: File[]) => void;
    class?: string;
  },
  ctx: Ctx,
) {
  const uid = `aster-fu-${++fuSeq}`;
  let files: File[] = [];
  let dragOver = false;
  let errorMsg = '';

  for (props of ctx) {
    const ingest = (incoming: FileList | null) => {
      if (!incoming) return;
      errorMsg = '';
      const accepted: File[] = [];
      const types = props.accept
        ?.toLowerCase()
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      for (const f of Array.from(incoming)) {
        if (
          types?.length &&
          !types.some((type) =>
            type.startsWith('.')
              ? f.name.toLowerCase().endsWith(type)
              : type.endsWith('/*')
                ? f.type.toLowerCase().startsWith(type.slice(0, -1))
                : f.type.toLowerCase() === type,
          )
        ) {
          errorMsg = f.name + ' is not an accepted file type.';
          continue;
        }
        if (props.maxSizeBytes !== undefined && f.size > props.maxSizeBytes) {
          errorMsg = `"${f.name}" exceeds max size of ${formatBytes(props.maxSizeBytes)}.`;
          continue;
        }
        accepted.push(f);
      }
      if (!accepted.length) return;
      files = props.multiple ? [...files, ...accepted] : accepted.slice(0, 1);
      props.onChange?.(files);
    };

    const removeAt = (idx: number) => {
      files = files.filter((_, i) => i !== idx);
      props.onChange?.(files);
    };

    yield (
      <div class={[fuScope, props.class].filter(Boolean).join(' ')}>
        {props.label ? (
          <label class="fu-label" for={uid}>
            {props.label}
          </label>
        ) : null}
        <label
          for={uid}
          class="dropzone"
          class:is-dragover={dragOver}
          on:dragover={(e: Event) => {
            e.preventDefault();
            dragOver = true;
          }}
          on:dragleave={() => (dragOver = false)}
          on:drop={(e: Event) => {
            e.preventDefault();
            dragOver = false;
            ingest((e as DragEvent).dataTransfer?.files ?? null);
          }}
        >
          <span class="dz-icon" aria-hidden="true">
            <Icon icon={UploadCloud} size={18} />
          </span>
          <span class="dz-title">Click to upload or drag and drop</span>
          <span class="dz-sub">
            {props.hint ??
              `${props.accept ?? 'Any file'}${props.maxSizeBytes ? ` · Max ${formatBytes(props.maxSizeBytes)}` : ''}`}
          </span>
          <input
            id={uid}
            type="file"
            class="native-file"
            accept={props.accept}
            multiple={props.multiple}
            onChange={(e: Event) => {
              const input = e.currentTarget as HTMLInputElement;
              ingest(input.files);
              input.value = '';
            }}
          />
        </label>

        {errorMsg ? (
          <span class="fu-error" role="alert">
            {errorMsg}
          </span>
        ) : null}

        {files.length > 0 ? (
          <div class="file-list">
            {files.map((f, idx) => (
              <div key={`${f.name}-${idx}`} class="file-row">
                <div class="file-meta">
                  <Icon icon={FileText} size={15} />
                  <span class="file-name">{f.name}</span>
                  <span class="file-size">{formatBytes(f.size)}</span>
                </div>
                <button
                  type="button"
                  class="file-rm"
                  aria-label={`Remove ${f.name}`}
                  onClick={() => removeAt(idx)}
                >
                  <Icon icon={X} size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}

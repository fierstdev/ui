# Integrating AsterUI

## Install, inspect and update owned files

| Command or option                    | Behavior                                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `vp dlx @fierst/ui list`             | List slugs, descriptions and direct registry dependencies.                                                               |
| `vp dlx @fierst/ui init`             | Install the shared theme controller, CSS and Lucide icon helper.                                                         |
| `vp dlx @fierst/ui add dialog toast` | Resolve both items and their transitive registry dependencies once, then copy their files. You can use add without init. |
| `--dir src/controls`                 | Change the destination from `src/ui`. Use the same directory for related items so sibling imports resolve.               |
| `--registry ./public/r`              | Read index.json and item manifests from a local directory. The default registry ships in the npm package.                |
| `--registry https://ui.fierst.dev/r` | Read manifests from an HTTP(S) base URL.                                                                                 |
| `--force`                            | Replace existing target files, including resolved dependencies. Without this flag existing files are skipped.            |

Run the npm dependency command printed by the installer. Registry dependencies are other source items, while package dependencies such as `@lucide/icons` belong in the consuming project. Use a versioned invocation such as `npx @fierst/ui@1.1.0 add dialog` for reproducible installs from the bundled registry. To update edited components, install the new version into a separate directory, compare the files and merge the changes you want. Include theme and icon dependencies in that comparison.

The Node API is available after installing `@fierst/ui` as a development dependency. Both functions return promises.

```js
import { addComponents, listRegistryItems } from '@fierst/ui/bin/aster-ui.mjs';

const items = await listRegistryItems();
const result = await addComponents(['dialog', 'toast'], process.cwd(), {
  uiDir: 'src/ui',
  force: false,
});
console.log(items.length, result.resolved, result.dependencies, result.copied, result.skipped);
```

Pass a registry path or URL to `listRegistryItems(source)` or use `{ registry: source }` with `addComponents`. The index lists each item's name, type, title, description, dependency arrays and file targets. Each item manifest includes the source content and SHA-256 digest for each file. The installer checks supplied digests and resolves dependencies before copying. If resolution fails, check the slug and registry base; for a checksum error rebuild or replace the inconsistent manifest.

## Render and update components

Use TSX with the Aster Vite plugin and `jsxImportSource: "@fierst/aster"`. Render components as JSX, including components implemented as generator functions. Aster supplies their context. In the reference, `View` denotes renderable content, `?` marks an optional prop, and destructuring defaults show the value used when omitted. Each contract names its callbacks and their payloads. Some wrap native events; others deliver the next value directly.

For a controlled switch, keep the value in the parent. For a standalone switch, pass `defaultChecked` for the initial value and optionally observe changes with `onChange`.

```tsx
import { signal } from '@fierst/aster';
import { Switch } from './ui/switch';

export function* Preferences() {
  const enabled = signal(true);
  for (;;) {
    yield (
      <Switch label="Email updates" checked={enabled()} onChange={(next) => enabled.set(next)} />
    );
  }
}
```

For a form, install `form input button`, give the input a name, and handle the submit event. `Form` prevents the browser's default navigation. `Input` associates its label, hint and error with the field. Give icon-only buttons an accessible name. Use a title on dialogs and meaningful row keys for dynamic data.

```tsx
import { Form, FormActions } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function ContactForm({ save }: { save: (email: string) => void }) {
  return (
    <Form
      onSubmit={(event) => {
        const data = new FormData(event.currentTarget as HTMLFormElement);
        save(String(data.get('email')));
      }}
    >
      <Input id="email" name="email" type="email" label="Email address" required />
      <FormActions>
        <Button type="submit">Save</Button>
      </FormActions>
    </Form>
  );
}
```

## Dialogs, decisions and notifications

Render a controlled overlay when the parent owns its open state. For a multi-step interaction, delegate from an Aster generator with `yield*`. The helper yields views until a decision arrives, then execution resumes with the result. Set the trigger back to idle before rendering the next frame.

```tsx
import { signal } from '@fierst/aster';
import { confirmDialog } from './ui/dialog';
import { Toaster, toast } from './ui/toast';

export function* Review() {
  const reviewing = signal(false);
  for (;;) {
    if (reviewing()) {
      const approved = yield* confirmDialog({ title: 'Approve the draft?' });
      reviewing.set(false);
      if (approved) toast.success('Draft approved');
    }
    yield (
      <>
        <button onClick={() => reviewing.set(true)}>Review draft</button>
        <Toaster />
      </>
    );
  }
}
```

Mount one `Toaster` for application notifications. `showToast` returns an id for `dismissToast`. The default duration is 3500 ms; a duration of zero keeps the toast until dismissal or displacement. The store retains up to five items.

| Helper             | Registry item | Result                                                                                       |
| ------------------ | ------------- | -------------------------------------------------------------------------------------------- |
| confirmDialog      | dialog        | true on confirmation, false on cancellation or dismissal                                     |
| confirmDestructive | alert-dialog  | boolean decision, with optional typed confirmation phrase                                    |
| pickCommand        | command       | selected CommandItem or null                                                                 |
| pickDate           | calendar      | selected YYYY-MM-DD string or null                                                           |
| runWizard          | stepper       | final state object or null on cancel; each step renders from state and can supply canProceed |
| promptDrawer       | drawer        | selected action id or null                                                                   |
| runTour            | tour          | true on completion, false on skip or an empty tour                                           |
| requestApproval    | approval-card | true on approval, false on rejection                                                         |

## Display records and charts

Install `data-table line-chart` for a sortable table and SVG chart. Column keys identify row fields. Supply a custom column render function for formatted cells. Line and area charts accept ordered label/value points.

```tsx
import { DataTable } from './ui/data-table';
import { AreaChart } from './ui/line-chart';

const rows = [
  { day: 'Monday', requests: 12 },
  { day: 'Tuesday', requests: 18 },
];
export function Traffic() {
  return (
    <>
      <DataTable
        rows={rows}
        rowKey={(row) => row.day}
        columns={[
          { key: 'day', header: 'Day' },
          { key: 'requests', header: 'Requests', sortable: true },
        ]}
      />
      <AreaChart
        label="Requests by day"
        data={rows.map((row) => ({ label: row.day, value: row.requests }))}
      />
    </>
  );
}
```

## Connect AI and human review workflows

Feed application messages to `ChatMessage`, response text to `StreamingText`, reasoning to `ReasoningBlock`, and tool activity to `ToolCallCard`. Use `PromptInput.onSubmit(prompt)` to start your request, update its `streaming` prop while generating, and wire `onStop` to your cancellation handler. Present sources with `CitationBadge` and `SourceList`, suggested prompts with `SuggestionChips`, and metering with `TokenUsageBar`.

Map workflow records to `WorkflowGraph` nodes with a stable id, label, optional detail and status. Status values are `pending`, `running`, `waiting`, `done`, `replayed`, and `failed`. Use `ApprovalCard` callbacks or `yield* requestApproval(...)` to collect a decision. Your application connects it to the corresponding workflow run and handles persistence, authorization, retries and tool execution. The showcase's AI workspace provides a complete UI composition.

import { ArrowLeft, ArrowRight, Rocket, Wand2 } from '@lucide/icons';
import { type Ctx } from '@fierst/aster';
import { PageHeader } from '../ui/page-header.tsx';
import { Stepper } from '../ui/stepper.tsx';
import { SegmentedControl } from '../ui/segmented-control.tsx';
import { Form, FormActions, FormSection } from '../ui/form.tsx';
import { Field, Label } from '../ui/label.tsx';
import { Input, Textarea } from '../ui/input.tsx';
import { Select } from '../ui/select.tsx';
import { MultiSelect } from '../ui/multi-select.tsx';
import { Combobox } from '../ui/combobox.tsx';
import { Checkbox, CheckboxGroup, RadioGroup } from '../ui/checkbox.tsx';
import { Switch } from '../ui/switch.tsx';
import { Toggle, ToggleGroup } from '../ui/toggle.tsx';
import { Slider } from '../ui/slider.tsx';
import { RangeSlider } from '../ui/range-slider.tsx';
import { NumberInput } from '../ui/number-input.tsx';
import { CurrencyInput } from '../ui/currency-input.tsx';
import { PasswordInput } from '../ui/password-input.tsx';
import { PhoneInput } from '../ui/phone-input.tsx';
import { InputOTP } from '../ui/input-otp.tsx';
import { ColorPicker } from '../ui/color-picker.tsx';
import { Calendar, DatePicker } from '../ui/calendar.tsx';
import { DateRangePicker } from '../ui/date-range-picker.tsx';
import { TimePicker } from '../ui/time-picker.tsx';
import { FileUpload } from '../ui/file-upload.tsx';
import { TagInput } from '../ui/tag-input.tsx';
import { InlineEdit } from '../ui/inline-edit.tsx';
import { Rating } from '../ui/rating.tsx';
import { StickyActionBar } from '../ui/sticky-bar.tsx';
import { Card } from '../ui/card.tsx';
import { Grid } from '../ui/grid.tsx';
import { Button } from '../ui/button.tsx';
import { Icon } from '../ui/icon.tsx';
import { toast } from '../ui/toast.tsx';
import { activeFlow, deployRelease, dirtySettings, releaseConfig, updateRelease } from './store.ts';

const REGIONS = [
  { value: 'pdx', label: 'us-west (PDX)', description: 'Portland edge cluster' },
  { value: 'iad', label: 'us-east (IAD)', description: 'Northern Virginia primary POP' },
  { value: 'fra', label: 'eu-central (FRA)', description: 'Frankfurt EU residency' },
  { value: 'nrt', label: 'ap-northeast (NRT)', description: 'Tokyo low-latency edge' },
];

export function* FormsWorkspace(_props: Record<string, any>, ctx: Ctx) {
  let step = 0;
  let layoutMode = 'wizard';
  let strictMode = true;
  let notifyChannels: string[] = ['slack', 'email'];
  let secretToken = 'ast_live_98xK2pQ!';

  for (let _p of ctx) {
    const cfg = releaseConfig();
    const isDirty = dirtySettings();
    const showAll = layoutMode === 'all';

    yield (
      <div style="display:grid; gap:1.25rem; padding-bottom:4rem">
        <PageHeader
          eyebrow="Release & Billing"
          title="Complete Form & Input Suite"
          description="Every AsterUI input primitive wired to a live release configuration. Saving deploys straight into Overview and Ops."
          actions={
            <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap">
              <SegmentedControl
                label="Form layout"
                value={layoutMode}
                options={[
                  { value: 'wizard', label: 'Step-by-Step' },
                  { value: 'all', label: 'All Sections' },
                ]}
                onChange={(v) => {
                  layoutMode = v;
                  ctx.refresh();
                }}
              />
              <Button variant="outline" onClick={() => activeFlow.set('wizard')}>
                <Icon icon={Wand2} size={14} />
                <span>Run yield* Wizard</span>
              </Button>
            </div>
          }
        />

        <Card>
          <Stepper
            currentStep={step}
            onStepClick={(i) => {
              step = i;
              ctx.refresh();
            }}
            steps={[
              { id: 's1', title: 'Project & Regions', description: 'Slug, POPs & tags' },
              { id: 's2', title: 'Schedule & Capacity', description: 'Calendar, bounds & budget' },
              { id: 's3', title: 'Security & Launch', description: '2FA, files & review' },
            ]}
          />
        </Card>

        <Form
          onSubmit={() => {
            deployRelease('Production');
          }}
        >
          {showAll || step === 0 ? (
            <Card title="1. Project & Regions">
              <FormSection
                title="Project Metadata"
                description="Click the project title inline to edit, or configure target regions and tags."
              >
                <div style="display:grid; gap:0.9rem; align-content:start">
                  <Field
                    label="Editable Display Name"
                    hint="Click text to edit inline (InlineEdit)"
                  >
                    <InlineEdit
                      value={cfg.projectName}
                      onSave={(next) => updateRelease('projectName', next)}
                    />
                  </Field>

                  <Input
                    label="Project Slug"
                    value={cfg.projectName}
                    leading="aster.fierst.dev/"
                    onInput={(e: Event) =>
                      updateRelease('projectName', (e.target as HTMLInputElement).value)
                    }
                  />

                  <Grid cols={2}>
                    <Select
                      label="Primary Region"
                      options={REGIONS}
                      value={cfg.region}
                      searchable
                      onChange={(v) => updateRelease('region', v)}
                    />
                    <Combobox
                      label="Runtime Preset (Combobox)"
                      options={[
                        'Aster + Vite+',
                        'Aster SSR Edge',
                        'Aster Web Components',
                        'Static Registry',
                      ]}
                      value={cfg.framework}
                      creatable
                      onChange={(v) => updateRelease('framework', v)}
                    />
                  </Grid>

                  <MultiSelect
                    label="Replica Regions (MultiSelect)"
                    options={REGIONS.map((r) => ({ value: r.value, label: r.label }))}
                    value={cfg.replicaRegions}
                    onChange={(vals) => updateRelease('replicaRegions', vals)}
                  />

                  <TagInput
                    label="Release Tags"
                    value={cfg.tags}
                    placeholder="Add tag and press Enter…"
                    onChange={(tags) => updateRelease('tags', tags)}
                  />
                </div>
              </FormSection>

              <FormSection
                title="Feature Flags & Tier"
                description="Checkboxes, Radio cards, Switch & ToggleGroup."
              >
                <div style="display:grid; gap:0.9rem; align-content:start">
                  <CheckboxGroup
                    legend="Enabled Capabilities"
                    value={cfg.features}
                    options={[
                      {
                        value: 'ssr',
                        label: 'Streaming SSR',
                        description: 'Out-of-order async function* flushes',
                      },
                      {
                        value: 'revive',
                        label: 'Lazy Revival',
                        description: '~0.6 KB delegated event loader',
                      },
                      {
                        value: 'wc',
                        label: 'Web Components',
                        description: 'Shadow DOM custom element export',
                      },
                    ]}
                    onChange={(next) => updateRelease('features', next)}
                  />
                  <Checkbox
                    indeterminate={cfg.features.length > 0 && cfg.features.length < 3}
                    checked={cfg.features.length === 3}
                    label="Select all capabilities"
                    onChange={(all) =>
                      updateRelease('features', all ? ['ssr', 'revive', 'wc'] : [])
                    }
                  />
                  <RadioGroup
                    legend="Deployment Tier"
                    card
                    value={cfg.plan}
                    options={[
                      {
                        value: 'hobby',
                        label: 'Starter — Free',
                        description: '100k edge requests/day',
                      },
                      {
                        value: 'pro',
                        label: 'Studio Pro — $20/mo',
                        description: 'Unlimited edge isolates & OIDC',
                      },
                    ]}
                    onChange={(v) => updateRelease('plan', v)}
                  />
                  <Switch
                    checked={cfg.autoRevive}
                    label="Automatic Lazy Revival"
                    description="Zero upfront hydration until first interaction."
                    onChange={(v) => updateRelease('autoRevive', v)}
                  />
                  <div style="display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap">
                    <Toggle
                      pressed={strictMode}
                      variant="outline"
                      onPressedChange={(p) => {
                        strictMode = p;
                        ctx.refresh();
                      }}
                    >
                      Strict CSP: {strictMode ? 'On' : 'Off'}
                    </Toggle>
                    <ToggleGroup
                      type="multiple"
                      label="Alert channels"
                      value={notifyChannels}
                      options={[
                        { value: 'slack', label: 'Slack', content: 'Slack' },
                        { value: 'email', label: 'Email', content: 'Email' },
                        { value: 'pager', label: 'PagerDuty', content: 'PagerDuty' },
                      ]}
                      onChange={(v) => {
                        notifyChannels = v;
                        ctx.refresh();
                      }}
                    />
                  </div>
                </div>
              </FormSection>

              {!showAll ? (
                <FormActions>
                  <Button
                    variant="primary"
                    onClick={() => {
                      step = 1;
                      ctx.refresh();
                    }}
                  >
                    <span>Next: Schedule & Capacity</span>
                    <Icon icon={ArrowRight} size={14} />
                  </Button>
                </FormActions>
              ) : null}
            </Card>
          ) : null}

          {showAll || step === 1 ? (
            <Card title="2. Schedule & Capacity">
              <Grid cols={2}>
                <div style="display:grid; gap:0.9rem; align-content:start">
                  <DatePicker
                    label="Target Release Date"
                    value={cfg.deployDate}
                    onChange={(iso) => updateRelease('deployDate', iso)}
                  />
                  <DateRangePicker
                    label="Maintenance Window"
                    value={cfg.windowRange}
                    onChange={(range) => updateRelease('windowRange', range)}
                  />
                  <TimePicker
                    label="Cutover Time (UTC)"
                    value={cfg.deployTime}
                    onChange={(hhmm) => updateRelease('deployTime', hhmm)}
                  />
                  <ColorPicker
                    label="Brand Accent Preview"
                    value={cfg.brandHex}
                    onChange={(hex) => updateRelease('brandHex', hex)}
                  />
                </div>

                <div style="display:grid; gap:0.9rem; align-content:start">
                  <Label>Inline Calendar</Label>
                  <Calendar
                    value={cfg.deployDate}
                    onChange={(iso) => updateRelease('deployDate', iso)}
                  />
                </div>
              </Grid>

              <Grid cols={2}>
                <Slider
                  label="Traffic Rollout"
                  value={cfg.rolloutPct}
                  min={0}
                  max={100}
                  unit="%"
                  showMarks
                  onChange={(v) => updateRelease('rolloutPct', v)}
                />
                <RangeSlider
                  label="Autoscale CPU Bounds"
                  value={cfg.autoscaleBounds}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={(r) => updateRelease('autoscaleBounds', r)}
                />
              </Grid>

              <Grid cols={2}>
                <NumberInput
                  label="Edge Replicas"
                  value={cfg.replicas}
                  min={1}
                  max={32}
                  unit="nodes"
                  onChange={(n) => updateRelease('replicas', n)}
                />
                <CurrencyInput
                  label="Monthly Spend Cap"
                  currency="USD"
                  value={cfg.monthlyCap}
                  onChange={(amt) => updateRelease('monthlyCap', amt)}
                />
              </Grid>

              {!showAll ? (
                <FormActions>
                  <Button
                    variant="outline"
                    onClick={() => {
                      step = 0;
                      ctx.refresh();
                    }}
                  >
                    <Icon icon={ArrowLeft} size={14} />
                    <span>Back</span>
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      step = 2;
                      ctx.refresh();
                    }}
                  >
                    <span>Next: Security & Launch</span>
                    <Icon icon={ArrowRight} size={14} />
                  </Button>
                </FormActions>
              ) : null}
            </Card>
          ) : null}

          {showAll || step === 2 ? (
            <Card title="3. Security & Launch">
              <Grid cols={2}>
                <div style="display:grid; gap:0.9rem; align-content:start">
                  <PasswordInput
                    label="Deploy Signing Secret"
                    value={secretToken}
                    showStrength
                    onChange={(v) => {
                      secretToken = v;
                      ctx.refresh();
                    }}
                  />
                  <PhoneInput
                    label="On-Call SMS Number"
                    value={cfg.phone}
                    onChange={(e164) => updateRelease('phone', e164)}
                  />
                  <InputOTP
                    label="Release Verification Code"
                    length={6}
                    separatorAt={3}
                    value={cfg.otp}
                    onChange={(code) => updateRelease('otp', code)}
                    onComplete={(code) => toast.success('OTP verified', `Code ${code} accepted`)}
                  />
                </div>

                <div style="display:grid; gap:0.9rem; align-content:start">
                  <FileUpload
                    label="Upload Release Bundle (.tar.gz / .json)"
                    multiple
                    hint="Simulated local attachment — never leaves your browser."
                    onChange={(files) => {
                      updateRelease(
                        'files',
                        files.map((f) => f.name),
                      );
                      toast.show('Files staged', `${files.length} file(s) ready`);
                    }}
                  />
                  <Textarea
                    label="Release Notes"
                    value={cfg.notes}
                    style="resize: vertical;"
                    onInput={(e: Event) =>
                      updateRelease('notes', (e.target as HTMLTextAreaElement).value)
                    }
                  />
                  <Rating
                    label="Release Confidence"
                    value={cfg.rating}
                    showValue
                    onChange={(r) => updateRelease('rating', r)}
                  />
                </div>
              </Grid>

              <FormActions>
                {!showAll ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      step = 1;
                      ctx.refresh();
                    }}
                  >
                    <Icon icon={ArrowLeft} size={14} />
                    <span>Back</span>
                  </Button>
                ) : null}
                <Button variant="outline" onClick={() => dirtySettings.set(false)}>
                  Discard
                </Button>
                <Button type="submit" variant="primary">
                  <Icon icon={Rocket} size={14} />
                  <span>Save & Deploy Release</span>
                </Button>
              </FormActions>
            </Card>
          ) : null}
        </Form>

        <StickyActionBar
          open={isDirty}
          message={
            <span>
              You have unsaved release configuration changes for <strong>{cfg.projectName}</strong>.
            </span>
          }
          actions={
            <div style="display:flex; gap:0.5rem">
              <Button size="sm" variant="outline" onClick={() => dirtySettings.set(false)}>
                Dismiss
              </Button>
              <Button size="sm" variant="primary" onClick={() => deployRelease('Production')}>
                Save & Deploy
              </Button>
            </div>
          }
        />
      </div>
    );
  }
}

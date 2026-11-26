export interface AddOptions {
  uiDir?: string;
  force?: boolean;
  registry?: string;
}

export interface AddResult {
  resolved: string[];
  dependencies: string[];
  copied: string[];
  skipped: string[];
}

export interface RegistryIndexItem {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  files: string[];
}

export function listRegistryItems(registrySource?: string): Promise<RegistryIndexItem[]>;
export function addComponents(
  names: readonly string[],
  projectRoot?: string,
  options?: AddOptions,
): Promise<AddResult>;

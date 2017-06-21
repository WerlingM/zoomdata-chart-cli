import { strEnum } from '../utilities';
export interface Visualization {
  id: string;
  templateId: string;
  templateType: string;
  name: string;
  accountId: string;
  enabled: boolean;
  type: string;
  components: Component[];
  libs: string[];
  objectFieldTypes: string[];
  controls: string[];
  thumbnailId: string;
  variables: any[];
  schemas: any;
  links: any[];
}

export interface Component {
  id: string;
  name: string;
  visualizationId: string;
  body: string;
  type: string;
  order: number;
  uploadDate: string;
  path: string;
  links: any[];
}

export interface Library {
  accountId: string;
  content: null[];
  filename: string;
  id: string;
  links: any[];
}

export const Control = strEnum([
  // 'Bookmark',
  'Color',
  'Configure',
  'ConfigureRaw',
  'Defaults',
  // 'DirtyDataIndicator',
  'Download',
  'Filters',
  // 'FiltersIndicator',
  'Info',
  // 'NoDataIndicator',
  'Rulers',
  // 'Share',
  'Sort',
  'TimeControl',
  'TimePlayer',
  // 'TimeTable',
  'UberStyle',
  'Undo',
  // 'Zoom',
]);

export type Control = keyof typeof Control;

export interface ControlDef {
  id: keyof typeof Control;
  name: string;
  description: string;
}

export const componentTypes = strEnum(['text/css', 'text/javascript']);

export type ComponentType = keyof typeof componentTypes;

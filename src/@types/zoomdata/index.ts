import { strEnum } from '../../utilities';
import * as Variables from './variables';

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
  variables: Variables.VariableDef[];
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
  accountId?: string;
  content: null[];
  filename: string;
  id: string;
  links: any[];
}

export interface Bookmarks {
  bookmarksMap: Bookmark[];
  otherBookmarksExist: boolean;
}

export interface Bookmark {
  createdByUserID: string;
  lastModifiedByUserID: string;
  createdDate: string;
  lastModifiedDate: string;
  id: string;
  name: string;
  accountId: string;
  userId: string;
  description: string;
  layout: string;
  shareState: keyof typeof ShareState;
  rememberTime: boolean;
  viewsCount: number;
  showDescription: boolean;
  unifiedBarCfgs: UnifiedControlsCfg[];
  visualizations: VisualizationDef[];
  selectedWidgetId: string;
  ownerName: string;
  type: string;
}

export interface Version {
  git: string;
  version: string;
  revision: string;
  buildTime: string;
  instanceId: string;
  links: any[];
}

const ShareState = strEnum(['NOT_SHARED', 'VIEW_ONLY', 'VIEW_AND_EDIT']);

interface UnifiedControlsCfg {
  dashboardId: string;
  id: string;
  playerControlCfg: PlayerControlCfg;
  sourceId: string;
  timeControlCfg: TimeControlCfg;
  visualizationDefId: string;
  widgetIds: string[];
}

interface PlayerControlCfg {
  pauseAfterRead?: boolean;
  speed?: number;
  stopTime?: string;
  timeWindowScale?: keyof typeof TimeWindowScale;
}

interface TimeControlCfg {
  from: string;
  max?: number;
  min?: number;
  timeField: string;
  to: string;
}

interface VisualizationDef {
  id: string;
  visId: string;
  ownerDashboardId: string;
  name: string;
  type: string;
  enabled: boolean;
  widgetId: string;
  layout: VisualizationLayout;
  source: SourceDetails;
  dashboardLink: DashboardLink;
  controlsCfg: ControlsCfg;
  lastModified: number;
}

interface VisualizationLayout {
  col: number;
  colSpan: number;
  row: number;
  rowSpan: number;
}

interface SourceDetails {
  filters: Filter[];
  live: boolean;
  playbackMode: boolean;
  sourceId: string;
  sourceName: string;
  sourceType: string;
  sparkIt: boolean;
  textSearchEnabled: boolean;
  variables: object;
}

interface DashboardLink {
  bookmarkId?: string;
  bookmarkName?: string;
  inheritFilterCfg?: boolean;
}

interface ControlsCfg {
  dashboardId: string;
  id: string;
  playerControlCfg: PlayerControlCfg;
  sourceId: string;
  timeControlCfg: TimeControlCfg;
  visualizationDefId: string;
}

interface Filter {
  form: string;
  label: string;
  operation: keyof typeof operations;
  path: string;
  value: string[] | object;
}

const operations = strEnum([
  'LT',
  'LE',
  'EQUALS',
  'EQUALSI',
  'GE',
  'GT',
  'IN',
  'NOTIN',
  'BETWEEN',
  'NOTEQUALS',
  'TEXT_SEARCH',
  'AND',
  'OR',
  'ISNOTNULL',
  'ISNULL',
]);

const TimeWindowScale = strEnum(['PINNED', 'ROLLING']);

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

export { Variables };

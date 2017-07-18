import { strEnum } from '../../../utilities';

export interface Core {
  name: string;
  descr: string;
  defaultValue?: any;
  colorMetric: boolean;
  colorNumb: number;
  required: boolean;
}

export interface Base extends Core {
  id?: string;
  visualizationId: string;
  type: Type;
}

export interface Group extends Base {
  type: 'group';
  attributeType: Array<'ATTRIBUTE' | 'TIME'>;
  config?: GroupConfigBase;
  groupType?: 'attribute' | 'time';
}

export interface MultiGroup extends Base {
  type: 'multi-group';
  attributeType: Array<'ATTRIBUTE' | 'TIME'>;
  config: MultiGroupConfig;
}

export interface HistogramGroup extends Base {
  type: 'histogram-group';
  attributeType: Array<'MONEY' | 'INTEGER' | 'NUMBER'>;
  config: HistogramGroupConfig;
}

export interface Metric extends Base {
  type: 'metric';
  attributeType: Array<'MONEY' | 'INTEGER' | 'NUMBER'>;
  metricType?: 'general' | 'color';
  legendType?: 'range' | 'palette';
  colors?: Color[];
  colorSet?: ColorSet;
}

export interface MultiMetric extends Base {
  type: 'multi-metric';
  attributeType: Array<'MONEY' | 'INTEGER' | 'NUMBER'>;
  metricType?: 'general' | 'color';
  legendType?: 'range' | 'palette';
  colors?: Color[];
  colorSet?: ColorSet;
}

export interface BoxPlotMetric extends Base {
  type: 'box-plot-metric';
  attributeType: Array<'MONEY' | 'INTEGER' | 'NUMBER'>;
  defaultValue: BoxPlotMetricDefault;
}

export interface Ungrouped extends Base {
  type: 'ungrouped';
  groupType?: 'attribute' | 'time';
  config: UngroupedConfig;
}

export interface UngroupedList extends Base {
  type: 'ungroupedList';
  attributeType: Array<'ATTRIBUTE' | 'MONEY' | 'INTEGER' | 'NUMBER'>;
  config: UngroupedListConfig;
}

export interface StringVar extends Base {
  type: 'string';
}

export interface Integer extends Base {
  type: 'integer';
  config: IntegerConfig;
}

export interface Float extends Base {
  type: 'float';
}

export interface Text extends Base {
  type: 'text';
}

export interface Bool extends Base {
  type: 'bool';
}

export interface Attribute extends Base {
  type: 'attribute';
  attributeType: Array<'ATTRIBUTE' | 'TIME' | 'MONEY' | 'INTEGER' | 'NUMBER'>;
}

export interface Singlelist extends Base {
  type: 'singlelist';
  values: string[];
}

export interface Multilist extends Base {
  type: 'multilist';
  attributeType?: Array<
    'ATTRIBUTE' | 'TIME' | 'MONEY' | 'INTEGER' | 'NUMBER' | 'CUSTOM'
  >;
  values?: string[];
}

export interface Color extends Base {
  type: 'color';
}

export interface BoxPlotMetricDefault {
  name: string;
  func: 'percentiles';
  args: Array<0 | 25 | 50 | 75 | 100>;
}

export interface GroupConfigBase {
  groupColorSet: ColorSet;
  colorGroupIndex: number;
  autoShowColorLegend?: boolean;
}

export type MultiGroupConfig = Partial<GroupConfigBase> & {
  groupLevel: number;
  groupNames: string[];
  groupLimits: number[];
  groupTypes: Array<
    | 'ATTRIBUTE'
    | 'ATTRIBUTE TIME'
    | 'NONE ATTRIBUTE TIME'
    | 'NONE ATTRIBUTE'
    | 'NONE TIME'
  >;
};

export interface HistogramGroupConfig {
  binsType: 'auto' | 'count' | 'width';
  binsCount: number;
  binsWidth: number;
  values: 'absolute' | 'relative';
  cumulative: boolean;
}

export interface UngroupedConfig {
  groupLevel: number;
  groupNames: string[];
  limit: number;
}

export interface UngroupedListConfig {
  groupLevel: number;
  limit: number;
}

export interface IntegerConfig {
  min: number;
  max: number;
}

export const types = strEnum([
  'attribute',
  'bool',
  'box-plot-metric',
  'color',
  'float',
  'group',
  'histogram-group',
  'integer',
  'metric',
  'multi-group',
  'multi-metric',
  'multilist',
  'singlelist',
  'string',
  'text',
  'ungrouped',
  'ungroupedList',
]);

export type Type = keyof typeof types;

export type GroupTypes = Array<
  | 'ATTRIBUTE'
  | 'ATTRIBUTE TIME'
  | 'NONE ATTRIBUTE TIME'
  | 'NONE ATTRIBUTE'
  | 'NONE TIME'
>;

export const colorSets = strEnum([
  'ZoomSequential',
  'ZoomPalette',
  'YlGn',
  'YlGnBu',
  'GnBu',
  'BuGn',
  'PuBuGn',
  'PuBu',
  'BuPu',
  'RdPu',
  'PuRd',
  'OrRd',
  'YlOrRd',
  'YlOrBr',
  'Purples',
  'Blues',
  'Greens',
  'Oranges',
  'Reds',
  'Greys',
  'PuOr',
  'BrBG',
  'PRGn',
  'PiYG',
  'RdBu',
  'RdGy',
  'RdYlBu',
  'Spectral',
  'RdYlGn',
  'Accent',
  'Dark2',
  'Paired',
  'Pastel1',
  'Pastel2',
  'Set1',
  'Set2',
  'Set3',
]);

export type ColorSet = keyof typeof colorSets;

export interface Color {
  name: string;
  label?: string;
  color: string;
}

export type VariableDef =
  | Group
  | MultiGroup
  | HistogramGroup
  | Metric
  | MultiMetric
  | BoxPlotMetric
  | StringVar
  | Integer
  | Float
  | Text
  | Bool
  | Attribute
  | Singlelist
  | Multilist
  | Color
  | Ungrouped
  | UngroupedList;

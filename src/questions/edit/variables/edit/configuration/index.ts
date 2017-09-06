import { Variables, Visualization } from '../../../../../@types/zoomdata/index';
import { VariableDef } from '../../../../../@types/zoomdata/variables/index';
import { Config } from '../../../../../commands/config';
import * as attributeQuestions from './attribute';
import * as boolQuestions from './bool';
import * as floatQuestions from './float';
import * as groupQuestions from './group';
import * as integerQuestions from './integer';
import * as metricQuestions from './metric';
import * as multiGroupQuestions from './multi-group';
import * as multiMetricQuestions from './multi-metric';
import * as multiListQuestions from './multilist';
import * as singleListQuestions from './singlelist';
import * as stringQuestions from './string';
import * as textQuestions from './text';
import * as ungroupedQuestions from './ungrouped';

function prompt(
  variable: VariableDef,
  visualization: Visualization,
  serverConfig: Config,
) {
  switch (variable.type) {
    case Variables.types.attribute:
      return attributeQuestions.prompt(variable, visualization, serverConfig);
    case Variables.types.bool:
      return boolQuestions.prompt(variable, visualization, serverConfig);
    case Variables.types.float:
      return floatQuestions.prompt(variable, visualization, serverConfig);
    case Variables.types.group:
      return groupQuestions.prompt(variable, visualization, serverConfig);
    case Variables.types.integer:
      return integerQuestions.prompt(variable, visualization, serverConfig);
    case Variables.types.metric:
      return metricQuestions.prompt(variable, visualization, serverConfig);
    case Variables.types['multi-group']:
      return multiGroupQuestions.prompt(variable, visualization, serverConfig);
    case Variables.types['multi-metric']:
      return multiMetricQuestions.prompt(variable, visualization, serverConfig);
    case Variables.types.multilist:
      return multiListQuestions.prompt(variable, visualization, serverConfig);
    case Variables.types.singlelist:
      return singleListQuestions.prompt(variable, visualization, serverConfig);
    case Variables.types.string:
      return stringQuestions.prompt(variable, visualization, serverConfig);
    case Variables.types.text:
      return textQuestions.prompt(variable, visualization, serverConfig);
    case Variables.types.ungrouped:
      return ungroupedQuestions.prompt(variable, visualization, serverConfig);
  }
}

export { prompt };

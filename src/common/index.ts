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

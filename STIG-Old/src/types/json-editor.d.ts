declare module '@json-editor/json-editor/dist/jsoneditor.js';

// The following types were found here:
// https://github.com/json-editor/json-editor/issues/127#issuecomment-554503424

declare interface SchemaOptions {
  properties: {
    fontSize: {
      options: {
        choices_options: any;
      };
    };
  };
}

declare type CSSIntegrationTypes =
    | 'barebones'
    | 'html'
    | 'bootstrap2'
    | 'bootstrap3'
    | 'bootstrap4'
    | 'foundation3'
    | 'foundation4'
    | 'foundation5'
    | 'foundation6'
    | 'jqueryui'
    | 'materialize';

declare type IconLibraries =
    | 'bootstrap2'
    | 'bootstrap3'
    | 'foundation2'
    | 'foundation3'
    | 'jqueryui'
    | 'fontawesome3'
    | 'fontawesome4'
    | 'fontawesome5'
    | 'materialicons';

declare interface JSONEditorOptions {
  // If true, JSON Editor will load external URLs in $ref via ajax.    false
  ajax?: boolean;
  // Allows schema references to work either with or without cors;
  // set to protocol://host:port when api is served by different host.
  ajaxBase?: string;
  // If true, JSON Editor will make ajax call with
  // [credentials](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials).    false
  ajaxCredentials?: boolean;
  // If true, the label will not be displayed/added.    false
  compact?: boolean;
  // If true, remove all "add row" buttons from arrays.    false
  disable_array_add?: boolean;
  // If true, remove all "delete row" buttons from arrays.    false
  disable_array_delete?: boolean;
  // If true, remove all "move up" and "move down" buttons from arrays.    false
  disable_array_reorder?: boolean;
  // If true, add copy buttons to arrays.    false
  enable_array_copy?: boolean;
  // If true, remove all collapse buttons from objects and arrays.    false
  disable_collapse?: boolean;
  // If true, remove all Edit JSON buttons from objects.    false
  disable_edit_json?: boolean;
  // If true, remove all Edit Properties buttons from objects.    false
  disable_properties?: boolean;
  // If true, array controls (add, delete etc) will be displayed at top of list.    false
  array_controls_top?: boolean;
  // The first part of the `name` attribute of form inputs in the editor.
  // An full example name is`root[person][name]` where "root" is the form_name_root.root
  form_name_root?: string;
  // The icon library to use for the editor. See the CSS Integration section below for more info.    null
  iconlib?: IconLibraries | null;
  // Display only icons in buttons. This works only if iconlib is set.    false
  remove_button_labels?: boolean;
  // If true, objects can only contain properties defined with the properties keyword.    false
  no_additional_properties?: boolean;
  // An object containing schema definitions for URLs. Allows you to pre-define external schemas.    {}
  refs?: any;
  // If true, all schemas that don't explicitly set the required property will be required.    false
  required_by_default?: boolean;
  // If true, makes oneOf copy properties over when switching.    true
  keep_oneof_values?: boolean;
  // A valid JSON Schema to use for the editor. Version 3 and Version 4 of the draft specification are supported.    {}
  schema?: any;
  // When to show validation errors in the UI. Valid values are interaction, change, always, and never.    "interaction"
  show_errors?: 'interaction' | 'change' | 'always' | 'never';
  // Seed the editor with an initial value. This should be valid against the editor's schema.    null
  startval?: any;
  // The JS template engine to use. See the Templates and Variables section below for more info.    default
  template?:
  | 'ejs'
  | 'handlebars'
  | 'hogan'
  | 'markup'
  | 'mustache'
  | 'swig'
  | 'underscore';
  // The CSS theme to use. See the CSS Integration section below for more info.    html
  theme?: CSSIntegrationTypes;
  // If true, only required properties will be included by default.    false
  display_required_only?: boolean;
  // If true, NON required properties will have an extra toggable checkbox near the title that determines
  // if the value must be included or not in the editor´s value    false
  show_opt_in?: boolean;
  // If true, displays a dialog box with a confirmation message before node deletion.    true
  prompt_before_delete?: boolean;
  // The default value of `format` for objects. If set to table for example, objects will use table layout
  // if `format` is not specified.    normal
  object_layout?: 'normal' | 'table' | 'grid';
}

declare class JSONEditor {
  constructor (element: Element, options?: JSONEditorOptions);

  static defaults: {
    options: JSONEditorOptions;
  };

  getValue (): any;
  on (event: string, callback: () => void): void;
  validate (): string[];
}

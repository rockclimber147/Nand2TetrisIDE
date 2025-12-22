import * as monaco from 'monaco-editor';

export interface MonacoLanguageSpec {
  id: string;
  extensions: string[];
  tokens: monaco.languages.IMonarchLanguage;
  configuration: monaco.languages.LanguageConfiguration;
}
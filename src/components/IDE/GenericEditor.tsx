import Editor, { type Monaco } from '@monaco-editor/react';
import { type MonacoLanguageSpec } from '../../core/Editor/types';

interface GenericEditorProps {
  spec: MonacoLanguageSpec;
  value?: string;
  onChange?: (value: string | undefined) => void;
  path?: string;
}

export const GenericEditor = ({ spec, value, onChange, path }: GenericEditorProps) => {
  const handleBeforeMount = (monaco: Monaco) => {
    if (!monaco.languages.getLanguages().some((lang: { id: string; }) => lang.id === spec.id)) {
      monaco.languages.register({ id: spec.id, extensions: spec.extensions });
      
      monaco.languages.setMonarchTokensProvider(spec.id, spec.tokens);
      monaco.languages.setLanguageConfiguration(spec.id, spec.configuration);
    }
  };

  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        path={path}
        language={spec.id}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        beforeMount={handleBeforeMount}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          fixedOverflowWidgets: true,
        }}
      />
    </div>
  );
};
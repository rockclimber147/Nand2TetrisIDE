import { useEffect, useRef } from 'react';
import Editor, { type Monaco } from '@monaco-editor/react';
import { type MonacoLanguageSpec } from '../../core/Editor/types';
import { CompilerError } from '../../core/Errors';

interface GenericEditorProps {
  spec: MonacoLanguageSpec;
  value?: string;
  onChange?: (value: string | undefined) => void;
  path?: string;
  errors: CompilerError[];
}

export const GenericEditor = ({ spec, value, onChange, path, errors }: GenericEditorProps) => {
  const monacoRef = useRef<Monaco | null>(null);
  const handleBeforeMount = (monaco: Monaco) => {
    if (!monaco.languages.getLanguages().some((lang: { id: string; }) => lang.id === spec.id)) {
      monaco.languages.register({ id: spec.id, extensions: spec.extensions });
      
      monaco.languages.setMonarchTokensProvider(spec.id, spec.tokens);
      monaco.languages.setLanguageConfiguration(spec.id, spec.configuration);
    }
  };

  useEffect(() => {
    if (monacoRef.current && path) {
      const monaco = monacoRef.current;
      const model = monaco.editor.getModel(monaco.Uri.file(path));

      if (model) {
        const markers = errors.map(err => ({
          startLineNumber: err.line,
          startColumn: err.column,
          endLineNumber: err.line,
          endColumn: err.column + (err.lexeme?.length || 1),
          message: err.message,
          severity: monaco.MarkerSeverity.Error,
        }));

        monaco.editor.setModelMarkers(model, spec.id, markers);
      }
    }
  }, [errors, path, spec.id]);

  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        path={path}
        language={spec.id}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        onMount={(_editor, monaco) => {
          monacoRef.current = monaco;
        }}
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
import Editor from '@monaco-editor/react';
import { registerJackLanguage } from '../../utils/MonacoJack';

export const JackEditor = () => {
  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        language="jack"
        theme="vs-dark"
        defaultValue="// Jack"
        beforeMount={(monaco) => registerJackLanguage(monaco)}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          padding: { top: 10 },
        }}
      />
    </div>
  );
};
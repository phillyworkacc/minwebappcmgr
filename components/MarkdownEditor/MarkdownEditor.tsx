import { InterFont } from '@/fonts/fonts';
import { compressImage, fileToBase64 } from '@/utils/imagePluginExtend';
import {
   headingsPlugin, 
   imagePlugin, 
   listsPlugin, 
   markdownShortcutPlugin, 
   MDXEditor, 
   quotePlugin
} from '@mdxeditor/editor'
import { useEffect, useRef, useState } from 'react';
import { updateActivityMarkdown } from '@/app/actions/activity';
import { CustomSpinner } from '../Spinner/Spinner';
import { CircleCheck, CircleX } from 'lucide-react';


function useDebouncedEffect(callback: Function, delay: number, deps: any[]) {
   const handler = useRef<any>(null);
   useEffect(() => {
      if (handler.current) clearTimeout(handler.current);
      handler.current = setTimeout(() => {
         callback();
      }, delay);

      return () => {
         if (handler.current) clearTimeout(handler.current);
      };
   }, deps);
}

export default function MarkdownEditor ({ markdownInitial, activityId }: { markdownInitial: string, activityId: string }) {
   const [markdown, setMarkdown] = useState(markdownInitial || '');
   const [saveStatus, setSaveStatus] = useState<boolean | 'loading'>(true);

   const updateMarkdownDesc = async () => {
      setSaveStatus('loading');
      const updated = await updateActivityMarkdown(activityId, markdown);
      setSaveStatus(updated);
   }

   useDebouncedEffect(() => {
      if (markdown.trim().length === 0) return;
      updateMarkdownDesc();
   }, 2000, [markdown]);

   return (
      <div className="box full df column gap-10" style={{ borderTop: "1px solid #e0e0e0", paddingTop: "20px", maxHeight: "50vh", position: "relative" }}>
         <div 
            className="box fit dfb align-center justify-end"
            style={{
               position: "absolute", top: 0, right: 0, padding: "0 10px",
               background: "white", borderRadius: "5px", boxShadow: "0 2px 4px rgba(0,0,0,0.094)"
            }}
         >
            <div className="text-xxs bold-500 fit dfb align-center gap-5">
               {saveStatus == 'loading' && (<><CustomSpinner size={18} /> Saving</>)}
               {saveStatus === false && (<><CircleX size={25} color='white' fill='#ff0000' /> Saving</>)}
               {saveStatus === true && (<><CircleCheck size={25} color='white' fill='#008000' /> Saved</>)}
            </div>
         </div>
         <MDXEditor 
            markdown={markdown}
            onChange={(md) => setMarkdown(md)}
            plugins={[
               headingsPlugin(), 
               listsPlugin(), 
               quotePlugin(), 
               markdownShortcutPlugin(), 
               imagePlugin({
                  imageUploadHandler: async (file) => {
                     const compressed = await compressImage(file);
                     const base64 = await fileToBase64(compressed);
                     return base64;
                  },
                  disableImageResize: true,
                  disableImageSettingsButton: true
               })
            ]}
            contentEditableClassName={`markdown-editor-contenteditable ${InterFont.className}`}
            className={`markdown-editor-class ${InterFont.className}`}
         />      
      </div>
   )
}

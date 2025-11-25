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
import { CloudAlert, CloudCheck, Cloudy } from 'lucide-react';


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
      <div className="box full df column gap-10" style={{ borderTop: "1px solid #ebe8e8", maxHeight: "60vh", position: "relative" }}>
         <div className="box full pd-2">
            <div className="text-xs bold-500 fit dfb align-center gap-5">
               {saveStatus == 'loading' && (<><Cloudy size={25} /> Saving</>)}
               {saveStatus === false && (<>
                  <CloudAlert size={25} color='#ff0000' /> <span style={{color:"#ff0000"}}>Failed to Save</span>
               </>)}
               {saveStatus === true && (<>
                  <CloudCheck size={25} color='#008000' /> <span style={{color:"#008000"}}>Saved</span>
               </>)}
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

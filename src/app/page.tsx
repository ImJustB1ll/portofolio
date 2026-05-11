import { createClient } from '@/utils/supabase/server';
import { ScrollSections } from '@/components/dom/ScrollSections';
import { CanvasWrapper } from '@/components/canvas/CanvasWrapper';

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('order_index', { ascending: true });

  if (error || !projects || projects.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-500">
        Failed to load portfolio data. Add projects via Supabase.
      </div>
    );
  }

  // Safely grab the very first project's asset URL directly from the server
  const initialModelUrl = projects[0]?.model_url || "";

  return (
    <>
      {/* Canvas initializes instantly with the real asset — zero flickering */}
      <CanvasWrapper initialModelUrl={initialModelUrl} />

      <div id="scroll-container" className="w-full relative z-10">
        <ScrollSections projects={projects} />
      </div>
    </>
  );
}
import { createClient } from '@/utils/supabase/server';
import { ScrollSections } from '@/components/dom/ScrollSections';
import { CanvasWrapper } from '@/components/canvas/CanvasWrapper';

export const revalidate = 60;

export default async function Home() {
  // 1. Initialize the SSR client (automatically inherits your .env.local variables)
  const supabase = await createClient();

  // 2. Fetch the raw portfolio showcases ordered by your sequence index
  const { data: rawProjects, error } = await supabase
    .from('projects')
    .select('*')
    .order('order_index', { ascending: true });

  if (error || !rawProjects || rawProjects.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-500">
        Failed to load portfolio data. Please add projects via your Supabase dashboard.
      </div>
    );
  }

  // 3. Map over the rows to safely append the absolute CDN URL using your environment variables
  const projects = rawProjects.map((project) => {
    // If someone accidentally pasted a full URL, use it directly to prevent double-prefixing bugs
    if (project.model_url.startsWith('http')) {
      return project;
    }

    // Otherwise, let the SDK construct the perfect absolute CDN path securely via env vars
    const { data } = supabase.storage
      .from('models')
      .getPublicUrl(project.model_url);

    return {
      ...project,
      model_url: data.publicUrl, // e.g., "https://<ENV_URL>/storage/v1/object/public/models/flagship.glb"
    };
  });

  // 4. Extract the resolved initial model URL safely for instant zero-flicker canvas hydration
  const initialModelUrl = projects[0]?.model_url || "";

  return (
    <>
      {/* R3F WebGL Context initializes instantly with the fully resolved environment path */}
      <CanvasWrapper initialModelUrl={initialModelUrl} />

      {/* Native HTML DOM overlays receive the complete array with attached dynamic paths */}
      <div id="scroll-container" className="w-full relative z-10">
        <ScrollSections projects={projects} />
      </div>
    </>
  );
}
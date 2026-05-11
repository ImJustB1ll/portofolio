// src/app/page.tsx
import { createClient } from '@/utils/supabase/server';
import { ScrollSections } from '@/components/dom/ScrollSections';

export const revalidate = 60; // Optional ISR: re-fetches backend data every 60 seconds

export default async function Home() {
  const supabase = await createClient();

  // Fetch live portfolio showcases ordered by your sequence index
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-500">
        Failed to load portfolio data.
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-gray-500">
        No projects found. Please add test rows via your Supabase dashboard.
      </div>
    );
  }

  return (
    <div id="scroll-container" className="w-full">
      <ScrollSections projects={projects} />
    </div>
  );
}
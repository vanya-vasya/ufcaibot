import {
  getApiUsedGenerations,
  getApiAvailableGenerations,
} from "@/lib/api-limit";
import { AnimatedLayout, AnimatedPage } from "@/components/animated-layout";
import DashboardHeaderUnified from "@/components/dashboard-header-unified";
import Footer from "@/components/landing/footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiUsedGenerations = await getApiUsedGenerations();
  const apiAvailableGenerations = await getApiAvailableGenerations();

  return (
    <div className="h-auto relative min-h-screen bg-black flex flex-col">
      <AnimatedLayout>
        <DashboardHeaderUnified 
          initialUsedGenerations={apiUsedGenerations}
          initialAvailableGenerations={apiAvailableGenerations}
        />
      </AnimatedLayout>

      <main className="flex-1 relative z-10">
        <AnimatedPage>{children}</AnimatedPage>
      </main>

      <Footer />
    </div>
  );
}

import { ProgressProvider } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";

/**
 * Layout da área logada da plataforma: shell com sidebar/menu mobile,
 * tema e provider de progresso. A landing page (/) fica fora deste grupo.
 */
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProgressProvider>
      <AppShell>{children}</AppShell>
    </ProgressProvider>
  );
}

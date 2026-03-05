import { PublicTenantView } from "@/components/public/PublicTenantView";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  
  if (!slug) return { title: "Negocio no encontrado" };

  const tenantName = slug.charAt(0).toUpperCase() + slug.slice(1);
  
  return {
    title: `${tenantName} | Portal`,
    description: `Conecta con el portal comercial de ${tenantName}`,
  };
}

export default async function PublicPage({ params }: { params: Params }) {
  const { slug } = await params;
  return <PublicTenantView slug={slug} />;
}

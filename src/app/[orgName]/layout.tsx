import { apiGetOrgByLoginName } from "@/api/webApi/organization";

export async function generateMetadata(
    { params }: { params: { orgName: string } }
  ) {
    const { orgName } = await params;
    const res = await apiGetOrgByLoginName(orgName);
    return {
        title: `${res.data?.name} - openrace - ${orgName}`,
        icons: res.data?.icon,
    }
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<>
  {children}
  </>
  );
}
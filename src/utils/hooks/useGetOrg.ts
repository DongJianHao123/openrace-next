import { useWebOrganizationsStore } from "@/store/organizations.store";

const useGetOrg = () => {
    const { organizations } = useWebOrganizationsStore();

    const getOrganizationById = (id: number) => {
        return organizations.find((org) => org.orgId === id);
    }
    const getOrganizationByLoginName = (loginName: string) => {
        return organizations.find((org) => org.loginName === loginName);
    };
    const getOrganizationLoginNameById = (id: number) => {
        return getOrganizationById(id)?.loginName;
    };

    return {
        getOrganizationById,
        getOrganizationByLoginName,
        getOrganizationLoginNameById,
    }
}

export default useGetOrg;
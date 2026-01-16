'use client'
import { apiGetOrganizations } from "@/api/webApi/organization";
import { IOrganization } from "@/types";
import { create } from "zustand";

interface OrganizationsState {
    organizations: IOrganization[];
    loadOrganizations: () => Promise<void>;
    setOrganizations: (organizations: IOrganization[]) => void,
}

// 2. 创建 Store
export const useWebOrganizationsStore = create<OrganizationsState>()(
    (set) => ({
        organizations: [],
        loadOrganizations: async () => {
            const organizations = await apiGetOrganizations({});
            set({ organizations: organizations?.data?.list || [] });
        },
        setOrganizations: (organizations) => set({ organizations: [...organizations] }),
    }),
)
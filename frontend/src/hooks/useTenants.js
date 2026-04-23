import { useState, useEffect } from 'react';
import api from '@/services/api';
export const useTenants = (propertyId) => {
    const [tenants, setTenants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchTenants = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // Fetch all units first, then their tenants
            const unitsResponse = await api.get(`/properties/${propertyId}/units`);
            const units = unitsResponse.data.data;
            const allTenants = [];
            for (const unit of units) {
                try {
                    const tenantsResponse = await api.get(`/units/${unit.id}/tenants`);
                    allTenants.push(...tenantsResponse.data.data);
                }
                catch (err) {
                    // Continue if unit has no tenants
                }
            }
            setTenants(allTenants);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tenants');
        }
        finally {
            setIsLoading(false);
        }
    };
    const createTenant = async (data) => {
        try {
            // Need unit_id to create tenant
            if (!data.unit_id)
                throw new Error('unit_id is required');
            const response = await api.post(`/units/${data.unit_id}/tenants`, data);
            setTenants([response.data.data, ...tenants]);
            return response.data.data;
        }
        catch (err) {
            throw err;
        }
    };
    const updateTenant = async (id, data) => {
        try {
            const response = await api.patch(`/tenants/${id}`, data);
            setTenants(tenants.map((t) => (t.id === id ? response.data.data : t)));
            return response.data.data;
        }
        catch (err) {
            throw err;
        }
    };
    const deleteTenant = async (id) => {
        try {
            await api.delete(`/tenants/${id}`);
            setTenants(tenants.filter((t) => t.id !== id));
        }
        catch (err) {
            throw err;
        }
    };
    useEffect(() => {
        if (propertyId) {
            fetchTenants();
        }
    }, [propertyId]);
    return {
        tenants,
        isLoading,
        error,
        fetchTenants,
        createTenant,
        updateTenant,
        deleteTenant,
    };
};

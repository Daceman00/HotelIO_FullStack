import axios from "../helpers/axios";

export async function getAllCRMEntries(params = {}) {
    try {
        const { data } = await axios.get(`/crm`, { params });
        return data;
    } catch (error) {
        console.error("Error fetching CRM entries:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch CRM entries");
    }
}

// Example usage with pagination:
// getAllCRMEntries({ page: 1, limit: 5 })
// getAllCRMEntries({ page: 2, limit: 10, sort: '-loyaltyPoints' })
// getAllCRMEntries({ page: 1, limit: 20, loyaltyTier: 'gold' })

export async function getCRMEntryById(id) {
    try {
        const { data } = await axios.get(`/crm/${id}`)
        return data;
    } catch (error) {
        console.error("Error fetching CRM entry:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch CRM entry");

    }
}

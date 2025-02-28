export const searchFilter = (items, searchTerm, fields) => {
    if (!searchTerm) return items;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    
    return items.filter(item => 
        fields.some(field => 
            String(item[field]).toLowerCase().includes(lowercaseSearch)
        )
    );
};

export const filterItems = (items, filters) => {
    return items.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true; // Skip empty filters
            return item[key] === value;
        });
    });
};
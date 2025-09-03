// src/utils/permissionService.js

/**
 * Defines the fields that can be partially updated by a WARD_OFFICER
 * on a child from another ward.
 */
const PARTIAL_UPDATE_FIELDS = [
    'vaccinations',
    'weightRecords',
    // You can add more fields here if needed.
];

/**
 * Defines a limited view of a child's data for users from different wards.
 */
const LIMITED_VIEW_FIELDS = [
    'id',
    'fullName',
    'sewaDartaNumber',
    'birthDate',
    'gender',
    'vaccinations',
    'weightRecords',
    'wardNumber'
];

/**
 * Checks if a user has permission to perform a specific action on a resource.
 * @param {object} user - The authenticated user object from the request.
 * @param {string} action - The action being performed ('read', 'update', 'delete').
 * @param {object} resource - The resource being acted upon (e.g., a child object).
 * @param {object} [dataToUpdate={}] - Optional data payload for 'update' actions.
 * @returns {boolean} - True if the action is permitted, false otherwise.
 */
export const checkPermission = (user, action, resource, dataToUpdate = {}) => {
    const { role, wardId } = user;
    const resourceWardId = resource?.wardNumber;

    // Case 1: SUPER_ADMIN has full access to everything.
    if (role === 'SUPER_ADMIN') {
        return true;
    }

    // Case 2: ADMIN has read-only access.
    if (role === 'ADMIN') {
        return action === 'read';
    }

    // Case 3: WARD_OFFICER
    if (role === 'WARD_OFFICER') {
        // A ward officer has full access to their own ward's data.
        if (wardId === resourceWardId) {
            return true;
        }

        // A ward officer can read data from other wards.
        if (action === 'read') {
            return true;
        }

        // For updates on children in other wards, check for partial access.
        if (action === 'update' && wardId !== resourceWardId) {
            const updateKeys = Object.keys(dataToUpdate);
            // Ensure all fields being updated are in the allowed list.
            const isPartialUpdateAllowed = updateKeys.every(key => PARTIAL_UPDATE_FIELDS.includes(key));
            return isPartialUpdateAllowed;
        }
    }

    // Deny by default.
    return false;
}

/**
 * Filters the data of a child based on the user's ward and role.
 * @param {object} user - The authenticated user object.
 * @param {object} child - The full child record to be filtered.
 * @returns {object} - The filtered child object.
 */
export const filterChildData = (user, child) => {
    const { role, wardId } = user;
    const childWardId = child.wardNumber;

    // SUPER_ADMIN and same-ward WARD_OFFICER can see full data.
    if (role === 'SUPER_ADMIN' || (role === 'WARD_OFFICER' && wardId === childWardId)) {
        return child;
    }

    // ADMIN and WARD_OFFICER viewing a different ward see limited data.
    const limitedData = {};
    for (const field of LIMITED_VIEW_FIELDS) {
        if (child.hasOwnProperty(field)) {
            limitedData[field] = child[field];
        }
    }

    return limitedData;
}


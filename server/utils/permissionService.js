// src/utils/permissionService.js

/**
 * Defines the fields that can be partially updated by a WARD_OFFICER
 * on a child from another ward.
 */
const PARTIAL_UPDATE_FIELDS = [
    'vaccinations',
    'weightRecords',
    'administeredById', // Add this
    'remarks', // Add this
    'removedVaccinations'
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
    console.log('=== PERMISSION CHECK DEBUG ===');
    console.log('User role:', user.role);
    console.log('User wardId:', user.wardId);
    console.log('Resource wardNumber:', resource?.wardNumber);
    console.log('Action:', action);
    console.log('Data to update keys:', Object.keys(dataToUpdate));
    console.log('Data to update values:', dataToUpdate);

    const { role, wardId } = user;
    const resourceWardId = resource?.wardNumber;

    // Case 1: SUPER_ADMIN has full access to everything.
    if (role === 'SUPER_ADMIN') {
        console.log('SUPER_ADMIN - ALLOWED');
        return true;
    }

    // Case 2: ADMIN has read-only access.
    if (role === 'ADMIN') {
        console.log('ADMIN - READ ONLY:', action === 'read');
        return action === 'read';
    }

    // Case 3: WARD_OFFICER
    if (role === 'WARD_OFFICER') {
        // A ward officer has full access to their own ward's data.
        if (wardId === resourceWardId) {
            console.log('SAME WARD - ALLOWED');
            return true;
        }

        // A ward officer can read data from other wards.
        if (action === 'read') {
            console.log('READ ACTION - ALLOWED');
            return true;
        }

        // For updates on children in other wards, check for partial access.
        if (action === 'update' && wardId !== resourceWardId) {
            const updateKeys = Object.keys(dataToUpdate);
            console.log('Update keys:', updateKeys);
            console.log('PARTIAL_UPDATE_FIELDS:', PARTIAL_UPDATE_FIELDS);

            // Ensure all fields being updated are in the allowed list.
            const isPartialUpdateAllowed = updateKeys.every(key => PARTIAL_UPDATE_FIELDS.includes(key));
            console.log('Is partial update allowed:', isPartialUpdateAllowed);

            return isPartialUpdateAllowed;
        }
    }

    console.log('DENIED BY DEFAULT');
    return false;
}


/**
 * Filters the data of a child based on the user's ward and role.
 * @param {object} user - The authenticated user object.
 * @param {object} child - The full child record to be filtered.
 * @returns {object} - The filtered child object.
 */
export const filterChildData = (user, child) => {
    console.log('=== DATA FILTERING DEBUG ===');
    const { role, wardId } = user;
    const childWardId = child.wardNumber;


    // SUPER_ADMIN gets full access
    if (role === 'SUPER_ADMIN') return child;

    // WARD_OFFICER from same ward gets full access
    if (role === 'WARD_OFFICER' && wardId === childWardId) return child;


    // Everyone else or different ward sees limited fields
    const limitedChild = {};
    for (const field of LIMITED_VIEW_FIELDS) {
        if (child.hasOwnProperty(field)) {
            limitedChild[field] = child[field];
        }
    }

    return limitedChild;
};
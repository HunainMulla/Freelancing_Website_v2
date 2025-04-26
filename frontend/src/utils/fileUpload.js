const validateImage = (file) => {
    // Check if file exists
    if (!file) return { isValid: false, error: 'No file selected' };

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        return { isValid: false, error: 'Please upload a valid image file (JPEG, PNG)' };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        return { isValid: false, error: 'Image size should be less than 5MB' };
    }

    return { isValid: true, error: null };
};

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export { validateImage, convertToBase64 }; 
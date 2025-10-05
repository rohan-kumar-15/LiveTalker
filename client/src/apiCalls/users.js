import { axiosInstance, url } from "./index"

export const getLoggedUser = async () => {
    try{
        const response = await axiosInstance.get(url + '/api/user/get-logged-user');
        return response.data;
    }catch(error) {
        return error;
    }
}

export const getAllUsers = async () => {
    try{
        const response = await axiosInstance.get(url+ '/api/user/get-all-users');
        return response.data;
    }catch(error) {
        return error;
    }
}


export const uploadProfilePic = async (image, userId) => {
    try {
        if (!userId) {
            return { success: false, message: "User ID missing" };
        }

        const response = await axiosInstance.post(url + 'api/user/upload-profile-pic', {
            image,
            userId,
        });

        return response.data;
    } catch (error) {
        console.error("Upload profile pic error:", error);
        return error?.response?.data || { success: false, message: 'Upload failed' };
    }
};






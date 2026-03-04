import { ref, watch } from "vue";
import api from "@/utils/api.js";
import { useToast } from "primevue/usetoast";

export function useUsers() {
    const users = ref([]);
    const loading = ref(false);
    const search = ref("");
    const selectedUser = ref(null);
    const toast = useToast();

    const getUsers = async () => {
        try {
            loading.value = true;
            const { data } = await api.get("/users");
            users.value = data;
        } catch {
            toast.add({ severity: "error", summary: "Xatolik", detail: "Foydalanuvchilar yuklanmadi", life: 3000 });
        } finally {
            loading.value = false;
        }
    };

    const findUser = async (query, type = null) => {
        try {
            loading.value = true;
            let params = {};

            if (type === "userId") params.userId = query;
            else if (query.startsWith("+") || query.startsWith("998")) params.phone = query;
            else if (/^[A-Za-z\s]+$/.test(query)) params.fullname = query;
            else if (/^\d{8,20}$/.test(query)) params.cardNumber = query;
            else params.autoNumber = query;

            const { data } = await api.get("/users/find", { params });

            const foundUser = data._id ? data : null;
            users.value = foundUser ? [foundUser] : [];

            if (foundUser) {
                selectedUser.value = foundUser;
                new Audio("/beep.mp3").play().catch(() => { });
            } else {
                new Audio("/error.mp3").play().catch(() => { });
                if (type !== "manual") { // avoid double toast for search watch
                    toast.add({ severity: "error", summary: "Xatolik", detail: "Foydalanuvchi topilmadi", life: 3000 });
                }
            }

            return foundUser;
        } catch (err) {
            users.value = [];
            new Audio("/error.mp3").play().catch(() => { });
            toast.add({ severity: "error", summary: "Xatolik", detail: "Foydalanuvchi topilmadi", life: 3000 });
            return null;
        } finally {
            loading.value = false;
        }
    };

    const refreshUser = async (userId) => {
        if (!userId) return;
        try {
            const { data } = await api.get("/users/find", { params: { userId } });
            if (selectedUser.value && selectedUser.value._id === userId) {
                selectedUser.value = data;
            }
            return data;
        } catch (e) {
            console.error("User refresh error", e);
        }
    };

    const updateUser = async (user) => {
        try {
            const res = await api.put(`/users/${user._id}`, user);
            toast.add({ severity: "success", summary: "Saqlandi", life: 3000 });
            if (selectedUser.value?._id === user._id) selectedUser.value = res.data;
            await getUsers();
            return true;
        } catch (err) {
            toast.add({ severity: "error", summary: "Xato", detail: "Saqlanmadi", life: 3000 });
            return false;
        }
    };

    const deleteUserById = async (userId) => {
        try {
            await api.delete(`/users/${userId}`);
            toast.add({ severity: "success", summary: "O‘chirildi", life: 3000 });
            if (selectedUser.value?._id === userId) selectedUser.value = null;
            await getUsers();
            return true;
        } catch (err) {
            toast.add({ severity: "error", summary: "Xato", detail: "O'chirilmadi", life: 3000 });
            return false;
        }
    };

    let searchTimeout;
    watch(search, (val) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (!val) return getUsers();
            findUser(val, "manual");
        }, 800);
    });

    return {
        users,
        loading,
        search,
        selectedUser,
        getUsers,
        findUser,
        refreshUser,
        updateUser,
        deleteUserById
    };
}

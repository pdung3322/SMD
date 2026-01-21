import { useEffect, useState } from "react";
import "./userpermission.css";
import { API_BASE } from "../../../services/api";

export default function UserPermission() {
    const [tab, setTab] = useState("ROLE"); // ROLE | USER

    const [roles, setRoles] = useState([]);
    const [modules, setModules] = useState([]);

    const [role, setRole] = useState("");
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");

    const [permissions, setPermissions] = useState({});

    /* ================= FETCH INIT ================= */

    useEffect(() => {
        fetch(`${API_BASE}/users/roles`)
            .then((res) => res.json())
            .then(setRoles);

        fetch(`${API_BASE}/permissions/modules`)
            .then((res) => res.json())
            .then(setModules);
    }, []);

    /* ================= ROLE CHANGE ================= */

    useEffect(() => {
        if (!role) return;

        setPermissions({});
        setUserId("");

        if (tab === "USER") {
            fetch(`${API_BASE}/users?role=${role}`)
                .then((res) => res.json())
                .then(setUsers);
        }

        fetch(`${API_BASE}/users/roles/${role}`)
            .then((res) => res.json())
            .then(setPermissions);
    }, [role, tab]);

    /* ================= USER CHANGE ================= */

    useEffect(() => {
        if (!userId || tab !== "USER") return;

        fetch(`${API_BASE}/user-permissions/${userId}`)
            .then((res) => res.json())
            .then(setPermissions);
    }, [userId, tab]);

    /* ================= HANDLERS ================= */

    const togglePermission = (moduleKey, actionKey) => {
        setPermissions((prev) => {
            const current = prev[moduleKey] || [];
            return {
                ...prev,
                [moduleKey]: current.includes(actionKey)
                    ? current.filter((a) => a !== actionKey)
                    : [...current, actionKey],
            };
        });
    };

    const handleSave = async () => {
        const url =
            tab === "ROLE"
                ? `${API_BASE}/users/roles/${role}`
                : `${API_BASE}/user-permissions/${userId}`;


        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ permissions }),
        });

        alert("Lưu phân quyền thành công");
    };

    /* ================= RENDER ================= */

    return (
        <div className="user-permission-page">
            <h2>Phân quyền người dùng</h2>

            <div className="permission-tabs">
                <button
                    className={tab === "ROLE" ? "active" : ""}
                    onClick={() => setTab("ROLE")}
                >
                    Theo vai trò
                </button>
                <button
                    className={tab === "USER" ? "active" : ""}
                    onClick={() => setTab("USER")}
                >
                    Theo cá nhân
                </button>
            </div>

            <div className="permission-role">
                <label>Vai trò:</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">-- Chọn vai trò --</option>
                    {roles.map((r) => (
                        <option key={r.key} value={r.key}>
                            {r.label}
                        </option>
                    ))}
                </select>

                {tab === "USER" && (
                    <>
                        <label>Người dùng:</label>
                        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
                            <option value="">-- Chọn người dùng --</option>
                            {users.map((u) => (
                                <option key={u.user_id} value={u.user_id}>
                                    {u.full_name}
                                </option>
                            ))}
                        </select>
                    </>
                )}
            </div>

            <table className="permission-table">
                <thead>
                    <tr>
                        <th>Chức năng</th>
                        <th>Quyền</th>
                    </tr>
                </thead>
                <tbody>
                    {modules.map((mod) => (
                        <tr key={mod.key}>
                            <td>{mod.name}</td>
                            <td>
                                {mod.actions.map((act) => (
                                    <label key={act.key} className="permission-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={permissions[mod.key]?.includes(act.key) || false}
                                            onChange={() => togglePermission(mod.key, act.key)}
                                        />
                                        {act.label}
                                    </label>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                className="permission-save"
                disabled={tab === "USER" && !userId}
                onClick={handleSave}
            >
                Lưu phân quyền
            </button>
        </div>
    );
}

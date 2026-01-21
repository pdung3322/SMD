import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./userimport.css";

export default function UserImport() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleImport = () => {
        if (!file) {
            alert("Vui lòng chọn file Excel");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);

        axios.post("http://127.0.0.1:8000/users/import", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })

            .then((res) => {
                alert(res.data.message || "Import thành công");
                navigate("/admin/users");
            })
            .catch((err) => {
                alert(
                    err.response?.data?.detail ||
                    "Import thất bại, kiểm tra lại file"
                );
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="user-import-page">
            <div className="user-import-header">
                <h2>Nhập danh sách người dùng</h2>
                <button onClick={() => navigate(-1)}>← Quay lại</button>
            </div>

            <div className="user-import-card">
                <div className="import-note">
                    <p>
                        File Excel phải có các cột:
                        <br />
                        <strong>full_name, email, password, mobile, role</strong>
                    </p>
                    <p>
                        Role hợp lệ: <code>ADMIN</code>, <code>HOD</code>,{" "}
                        <code>LECTURER</code>, <code>AA</code>,{" "}
                        <code>PRINCIPAL</code>, <code>STUDENT</code>
                    </p>
                </div>

                <div className="import-form">
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                    />

                    <button
                        className="btn-primary"
                        onClick={handleImport}
                        disabled={loading}
                    >
                        {loading ? "Đang import..." : "Import người dùng"}
                    </button>
                </div>
            </div>
        </div>
    );
}

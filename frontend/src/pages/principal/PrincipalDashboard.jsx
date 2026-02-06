import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, Eye, Info, Calendar } from 'lucide-react';
import './PrincipalDashboard.css';
import { getNotifications, approveSyllabus, rejectSyllabus } from '../../services/principal';

const PrincipalDashboard = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedItem, setSelectedItem] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

    async function fetchItems() {
        try {
            const data = await getNotifications();
            const mapped = data.map(d => ({
                id: d.syllabus_id,
                name: d.course_name,
                creator: '—',
                dept: d.course_code,
                deadline: d.submitted_date ? new Date(d.submitted_date).toLocaleString() : '—',
                status: (d.status || 'PENDING').toLowerCase(),
                priority: 'High',
                note: '',
                workflow_id: d.workflow_id,
                syllabus_id: d.syllabus_id
            }));
            setItems(mapped);
        } catch (e) {
            console.error(e);
            alert('Không thể lấy thông báo');
        }
    }

    async function handleApprove(item) {
        try {
            await approveSyllabus(item.syllabus_id);
            alert('Đã phê duyệt');
            fetchItems();
            setSelectedItem(null);
        } catch (e) {
            console.error(e);
            alert('Phê duyệt thất bại');
        }
    }

    async function handleReject(item) {
        const reason = prompt('Nhập lý do từ chối:');
        if (!reason) return;
        try {
            await rejectSyllabus(item.syllabus_id, reason);
            alert('Đã từ chối');
            fetchItems();
            setSelectedItem(null);
        } catch (e) {
            console.error(e);
            alert('Từ chối thất bại');
        }
    }

    const filteredData = items.filter(item => item.status === activeTab);

    return (
        <div className="dashboard-wrapper">
            <div className="content-container">
                <header className="main-header">
                    <div>
                        <h1>Quản lý phê duyệt giáo trình</h1>
                    </div>
                    <div className="status-summary">
                        <span className="dot-pulse"></span> Đang trực tuyến
                    </div>
                </header>

                {/* Workflow Tabs */}
                <nav className="tab-navigation">
                    <button className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>
                        <Clock size={18} /> Cần duyệt ngay <span className="tab-count">2</span>
                    </button>
                    <button className={activeTab === 'approved' ? 'active' : ''} onClick={() => setActiveTab('approved')}>
                        <CheckCircle size={18} /> Đã duyệt
                    </button>
                    <button className={activeTab === 'rejected' ? 'active' : ''} onClick={() => setActiveTab('rejected')}>
                        <XCircle size={18} /> Bị từ chối
                    </button>
                </nav>

                <div className="layout-body">
                    <section className={`table-container ${selectedItem ? 'compressed' : ''}`}>
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>Tên giáo trình</th>
                                    <th>Khoa / Viện</th>
                                    <th>Hạn xử lý</th>
                                    <th className="text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map(item => (
                                    <tr key={item.id} className={selectedItem?.id === item.id ? 'active-row' : ''}>
                                        <td>
                                            <div className="name-cell">
                                                <span className={`priority-tag ${item.priority.toLowerCase()}`}></span>
                                                {item.name}
                                            </div>
                                        </td>
                                        <td><span className="dept-badge">{item.dept}</span></td>
                                        <td>
                                            <div className="date-cell"><Calendar size={14} /> {item.deadline}</div>
                                        </td>
                                        <td className="text-right">
                                            <button className="btn-action" onClick={() => setSelectedItem(item)}>
                                                Xem chi tiết <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    {/* Side Detail Panel */}
                    {selectedItem && (
                        <aside className="detail-panel">
                            <div className="panel-inner">
                                <button className="close-panel" onClick={() => setSelectedItem(null)}>×</button>
                                <h3>Chi tiết đề cương</h3>

                                <div className="detail-card">
                                    <div className="detail-row">
                                        <span>Người soạn thảo:</span>
                                        <strong>{selectedItem.creator}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Trạng thái AA:</span>
                                        <span className="status-tag success">Đã thẩm định</span>
                                    </div>
                                </div>

                                <div className="aa-suggestion">
                                    <div className="suggestion-header">
                                        <Info size={16} /> AA đề xuất:
                                    </div>
                                    <p>{selectedItem.note}</p>
                                </div>

                                <div className="action-footer">
                                    <button className="btn-approve-main" onClick={() => handleApprove(selectedItem)}>Phê duyệt ngay</button>
                                    <button className="btn-reject-main" onClick={() => handleReject(selectedItem)}>Yêu cầu chỉnh sửa</button>
                                </div>
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
}
    export default PrincipalDashboard;
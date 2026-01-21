import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import "./compare.css";

/**
 * Compare (HoD)
 * - Mục tiêu: So sánh phiên bản đề cương giữa các năm/phiên bản để đảm bảo tính nhất quán.
 * - Sau này thay mock bằng API:
 *    GET /api/syllabi/{syllabusId}/versions
 *    GET /api/syllabi/{syllabusId}/versions/{versionId}
 */

export default function Compare() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const syllabusIdFromQuery = searchParams.get("syllabusId");

    const [loading, setLoading] = useState(true);

    // list syllabus + versions (mock)
    const [syllabi, setSyllabi] = useState([]);
    const [versionsBySyllabus, setVersionsBySyllabus] = useState({});

    // selection
    const [syllabusId, setSyllabusId] = useState(syllabusIdFromQuery || "");
    const [verA, setVerA] = useState("");
    const [verB, setVerB] = useState("");

    useEffect(() => {
        // ===== MOCK DATA =====
        const mockSyllabi = [
            { id: "101", subject_code: "MTH101", course_name: "Toán Cao Cấp" },
            { id: "102", subject_code: "WEB201", course_name: "Lập Trình Web" },
            { id: "103", subject_code: "SE301", course_name: "Công nghệ phần mềm" },
        ];

        const mockVersions = {
            "101": [
                {
                    version_id: "v1",
                    year: "2023-2024",
                    updated_at: "2025-05-01",
                    snapshot: {
                        overview: "Toán cao cấp (bản 2023-2024). Nội dung tập trung giải tích 1.",
                        clo: ["CLO1: Giải bài toán giới hạn", "CLO2: Tính đạo hàm và ứng dụng"],
                        assessments: [
                            { name: "Giữa kỳ", weight: 30 },
                            { name: "Cuối kỳ", weight: 70 },
                        ],
                    },
                },
                {
                    version_id: "v2",
                    year: "2024-2025",
                    updated_at: "2026-01-02",
                    snapshot: {
                        overview: "Toán cao cấp (bản 2024-2025). Bổ sung phần tích phân ứng dụng.",
                        clo: ["CLO1: Giải bài toán giới hạn", "CLO2: Tính đạo hàm và ứng dụng", "CLO3: Ứng dụng tích phân"],
                        assessments: [
                            { name: "Giữa kỳ", weight: 40 },
                            { name: "Cuối kỳ", weight: 60 },
                        ],
                    },
                },
                {
                    version_id: "v3",
                    year: "2024-2025",
                    updated_at: "2026-01-05",
                    snapshot: {
                        overview: "Toán cao cấp (bản 2024-2025). Chuẩn hóa CLO + bổ sung rubric.",
                        clo: ["CLO1: Giải bài toán giới hạn", "CLO2: Tính đạo hàm và ứng dụng", "CLO3: Ứng dụng tích phân", "CLO4: Diễn giải kết quả bằng ngôn ngữ toán học"],
                        assessments: [
                            { name: "Bài tập", weight: 10 },
                            { name: "Giữa kỳ", weight: 30 },
                            { name: "Cuối kỳ", weight: 60 },
                        ],
                    },
                },
            ],
            "102": [
                {
                    version_id: "v1",
                    year: "2023-2024",
                    updated_at: "2025-03-10",
                    snapshot: {
                        overview: "Web v1: HTML/CSS/JS cơ bản.",
                        clo: ["CLO1: Xây dựng trang tĩnh", "CLO2: JS DOM"],
                        assessments: [
                            { name: "Project", weight: 50 },
                            { name: "Final", weight: 50 },
                        ],
                    },
                },
                {
                    version_id: "v2",
                    year: "2024-2025",
                    updated_at: "2026-01-02",
                    snapshot: {
                        overview: "Web v2: Thêm React + API integration.",
                        clo: ["CLO1: Xây dựng trang tĩnh", "CLO2: JS DOM", "CLO3: React component + gọi API"],
                        assessments: [
                            { name: "Project", weight: 60 },
                            { name: "Final", weight: 40 },
                        ],
                    },
                },
            ],
            "103": [
                {
                    version_id: "v1",
                    year: "2023-2024",
                    updated_at: "2025-05-11",
                    snapshot: {
                        overview: "SE: Quy trình phát triển phần mềm, UML, test.",
                        clo: ["CLO1: UML Usecase", "CLO2: Viết SRS cơ bản"],
                        assessments: [
                            { name: "Bài tập", weight: 30 },
                            { name: "Đồ án", weight: 70 },
                        ],
                    },
                },
            ],
        };

        setSyllabi(mockSyllabi);
        setVersionsBySyllabus(mockVersions);
        setLoading(false);
    }, []);

    // auto pick versions when syllabus changes
    useEffect(() => {
        if (!syllabusId) return;
        const list = versionsBySyllabus[syllabusId] || [];
        if (list.length >= 2) {
            setVerA(list[0].version_id);
            setVerB(list[list.length - 1].version_id);
        } else if (list.length === 1) {
            setVerA(list[0].version_id);
            setVerB(list[0].version_id);
        } else {
            setVerA("");
            setVerB("");
        }
    }, [syllabusId, versionsBySyllabus]);

    const syllabus = useMemo(() => syllabi.find((s) => s.id === syllabusId), [syllabi, syllabusId]);

    const versionList = useMemo(() => versionsBySyllabus[syllabusId] || [], [versionsBySyllabus, syllabusId]);

    const dataA = useMemo(() => versionList.find((v) => v.version_id === verA), [versionList, verA]);
    const dataB = useMemo(() => versionList.find((v) => v.version_id === verB), [versionList, verB]);

    // Simple diff helpers (đủ để demo đúng yêu cầu)
    const diffText = (a = "", b = "") => {
        if (a === b) return { same: true, a, b };
        return { same: false, a, b };
    };

    const diffList = (a = [], b = []) => {
        const setA = new Set(a);
        const setB = new Set(b);
        const added = b.filter((x) => !setA.has(x));
        const removed = a.filter((x) => !setB.has(x));
        const same = added.length === 0 && removed.length === 0;
        return { same, added, removed, a, b };
    };

    const diffAssess = (a = [], b = []) => {
        // compare by name
        const mapA = new Map(a.map((x) => [x.name, x.weight]));
        const mapB = new Map(b.map((x) => [x.name, x.weight]));
        const names = Array.from(new Set([...mapA.keys(), ...mapB.keys()]));
        const rows = names.map((name) => ({
            name,
            a: mapA.has(name) ? mapA.get(name) : null,
            b: mapB.has(name) ? mapB.get(name) : null,
            changed: mapA.get(name) !== mapB.get(name),
        }));
        const same = rows.every((r) => !r.changed);
        return { same, rows };
    };

    const overviewDiff = useMemo(() => {
        return diffText(dataA?.snapshot?.overview || "", dataB?.snapshot?.overview || "");
    }, [dataA, dataB]);

    const cloDiff = useMemo(() => {
        return diffList(dataA?.snapshot?.clo || [], dataB?.snapshot?.clo || []);
    }, [dataA, dataB]);

    const assessDiff = useMemo(() => {
        return diffAssess(dataA?.snapshot?.assessments || [], dataB?.snapshot?.assessments || []);
    }, [dataA, dataB]);

    if (loading) return <div className="compare-page">Đang tải...</div>;

    return (
        <div className="compare-page">
            <div className="compare-header">
                <div>
                    <h1 className="compare-title">So sánh phiên bản đề cương</h1>
                    <p className="compare-subtitle">
                        HoD dùng trang này để đối chiếu thay đổi giữa các phiên bản theo năm học/môn học (phục vụ đảm bảo nhất quán & audit).
                    </p>
                </div>

                <Link className="btn btn-ghost" to="/hod/lookup">
                    Quay lại tra cứu
                </Link>
            </div>

            <div className="card">
                <div className="compare-controls">
                    <div className="field">
                        <label>Chọn đề cương</label>
                        <select value={syllabusId} onChange={(e) => setSyllabusId(e.target.value)}>
                            <option value="">-- Chọn --</option>
                            {syllabi.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.subject_code} — {s.course_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label>Version A</label>
                        <select value={verA} onChange={(e) => setVerA(e.target.value)} disabled={!syllabusId}>
                            {versionList.map((v) => (
                                <option key={v.version_id} value={v.version_id}>
                                    {v.version_id} • {v.year} • {new Date(v.updated_at).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label>Version B</label>
                        <select value={verB} onChange={(e) => setVerB(e.target.value)} disabled={!syllabusId}>
                            {versionList.map((v) => (
                                <option key={v.version_id} value={v.version_id}>
                                    {v.version_id} • {v.year} • {new Date(v.updated_at).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field actions-row">
                        <button className="btn btn-primary" disabled={!syllabusId || !verA || !verB}>
                            (Demo) AI Detect Changes
                        </button>
                        <button className="btn btn-ghost" onClick={() => navigate("/hod/review/pending")} title="Quay lại pipeline duyệt">
                            Về danh sách chờ duyệt
                        </button>
                    </div>
                </div>
            </div>

            {!syllabusId ? (
                <div className="card">
                    <div className="empty">Hãy chọn một đề cương để bắt đầu so sánh.</div>
                </div>
            ) : (
                <>
                    {/* META */}
                    <div className="card">
                        <div className="meta">
                            <div>
                                <div className="muted small">Đề cương</div>
                                <div className="meta-strong">{syllabus?.subject_code} — {syllabus?.course_name}</div>
                            </div>
                            <div>
                                <div className="muted small">A</div>
                                <div className="mono">{verA || "-"}</div>
                            </div>
                            <div>
                                <div className="muted small">B</div>
                                <div className="mono">{verB || "-"}</div>
                            </div>
                        </div>
                    </div>

                    {/* DIFF SECTIONS */}
                    <div className="grid-2">
                        {/* Overview */}
                        <div className={`card ${overviewDiff.same ? "" : "card-changed"}`}>
                            <div className="section-head">
                                <h3>Tổng quan / Mô tả</h3>
                                <span className={`pill ${overviewDiff.same ? "pill-same" : "pill-changed"}`}>
                                    {overviewDiff.same ? "Không đổi" : "Có thay đổi"}
                                </span>
                            </div>

                            <div className="split">
                                <div className="split-col">
                                    <div className="muted small">Version A</div>
                                    <div className="box">{overviewDiff.a || "—"}</div>
                                </div>
                                <div className="split-col">
                                    <div className="muted small">Version B</div>
                                    <div className="box">{overviewDiff.b || "—"}</div>
                                </div>
                            </div>
                        </div>

                        {/* CLO */}
                        <div className={`card ${cloDiff.same ? "" : "card-changed"}`}>
                            <div className="section-head">
                                <h3>CLO (Course Learning Outcomes)</h3>
                                <span className={`pill ${cloDiff.same ? "pill-same" : "pill-changed"}`}>
                                    {cloDiff.same ? "Không đổi" : "Có thay đổi"}
                                </span>
                            </div>

                            <div className="split">
                                <div className="split-col">
                                    <div className="muted small">Version A</div>
                                    <ul className="list">
                                        {(cloDiff.a || []).map((x) => (
                                            <li key={x}>{x}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="split-col">
                                    <div className="muted small">Version B</div>
                                    <ul className="list">
                                        {(cloDiff.b || []).map((x) => (
                                            <li key={x}>{x}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {!cloDiff.same && (
                                <div className="diff-summary">
                                    {cloDiff.added.length > 0 && (
                                        <div className="diff-block">
                                            <div className="diff-title">Thêm mới</div>
                                            <ul className="list compact">
                                                {cloDiff.added.map((x) => (
                                                    <li key={x} className="added">{x}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {cloDiff.removed.length > 0 && (
                                        <div className="diff-block">
                                            <div className="diff-title">Bị bỏ</div>
                                            <ul className="list compact">
                                                {cloDiff.removed.map((x) => (
                                                    <li key={x} className="removed">{x}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Assessments */}
                        <div className={`card ${assessDiff.same ? "" : "card-changed"}`}>
                            <div className="section-head">
                                <h3>Trọng số đánh giá</h3>
                                <span className={`pill ${assessDiff.same ? "pill-same" : "pill-changed"}`}>
                                    {assessDiff.same ? "Không đổi" : "Có thay đổi"}
                                </span>
                            </div>

                            <div className="table-wrap">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Hạng mục</th>
                                            <th>Version A</th>
                                            <th>Version B</th>
                                            <th>Ghi chú</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assessDiff.rows.map((r) => (
                                            <tr key={r.name}>
                                                <td className="primary">{r.name}</td>
                                                <td className="mono">{r.a === null ? "—" : `${r.a}%`}</td>
                                                <td className="mono">{r.b === null ? "—" : `${r.b}%`}</td>
                                                <td>
                                                    {r.changed ? <span className="pill pill-changed">Thay đổi</span> : <span className="pill pill-same">Giữ nguyên</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <p className="muted small" style={{ marginTop: 10 }}>
                                * Sau này có thể bổ sung: PLO mapping diff, nội dung chi tiết theo từng section, AI semantic diff…
                            </p>
                        </div>

                        {/* Placeholder for future (PLO mapping / module relation) */}
                        <div className="card">
                            <div className="section-head">
                                <h3>Mở rộng theo đề tài</h3>
                                <span className="pill pill-same">Gợi ý</span>
                            </div>
                            <ul className="list">
                                <li>So sánh CLO → PLO mapping (AA/HOD hay dùng để kiểm tra chuẩn đầu ra).</li>
                                <li>So sánh “module relationships” (tiên quyết/song hành/bổ trợ).</li>
                                <li>Hiển thị “AI Change Detection” dạng highlight theo section.</li>
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

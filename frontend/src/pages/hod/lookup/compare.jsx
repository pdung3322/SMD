import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllSyllabi, getSyllabusVersions } from "../../../services/api";
import "./compare.css";

// Diff helpers
const diffText = (a = "", b = "") => ({ same: a === b, a, b });

const diffList = (a = [], b = []) => {
    const setA = new Set(a);
    const setB = new Set(b);
    const added = b.filter((x) => !setA.has(x));
    const removed = a.filter((x) => !setB.has(x));
    return { same: added.length === 0 && removed.length === 0, added, removed, a, b };
};

const diffAssess = (a = [], b = []) => {
    const mapA = new Map(a.map((x) => [x.name, x.weight]));
    const mapB = new Map(b.map((x) => [x.name, x.weight]));
    const names = Array.from(new Set([...mapA.keys(), ...mapB.keys()]));
    const rows = names.map((name) => {
        const left = mapA.get(name);
        const right = mapB.get(name);
        return { name, a: left ?? null, b: right ?? null, changed: left !== right };
    });
    return { same: rows.every((r) => !r.changed), rows };
};

export default function Compare() {
    const [searchParams] = useSearchParams();
    const syllabusIdFromQuery = searchParams.get("syllabusId") || "";

    const [searchQ, setSearchQ] = useState("");
    const [syllabusId, setSyllabusId] = useState(syllabusIdFromQuery);
    const [verA, setVerA] = useState("");
    const [verB, setVerB] = useState("");

    const [syllabi, setSyllabi] = useState([]);
    const [versionList, setVersionList] = useState([]);
    const [loadingSyllabi, setLoadingSyllabi] = useState(false);
    const [loadingVersions, setLoadingVersions] = useState(false);
    const [error, setError] = useState("");

    // Fetch syllabi once
    useEffect(() => {
        const load = async () => {
            try {
                setLoadingSyllabi(true);
                setError("");
                const data = await getAllSyllabi();
                setSyllabi(data || []);
            } catch (err) {
                console.error(err);
                setError("Không thể tải danh sách giáo trình");
            } finally {
                setLoadingSyllabi(false);
            }
        };
        load();
    }, []);

    // Fetch versions when syllabus changes
    useEffect(() => {
        const loadVersions = async () => {
            if (!syllabusId) {
                setVersionList([]);
                return;
            }
            try {
                setLoadingVersions(true);
                setError("");
                const data = await getSyllabusVersions(syllabusId);
                const mapped = (data || []).map((v) => ({
                    version_id: `v${v.version_number}`,
                    year: "",
                    updated_at: v.created_at,
                    snapshot: {
                        overview: v.content || "",
                        clo: [],
                        assessments: [],
                    },
                }));
                setVersionList(mapped);
            } catch (err) {
                console.error(err);
                setError("Không thể tải phiên bản giáo trình");
                setVersionList([]);
            } finally {
                setLoadingVersions(false);
            }
        };
        loadVersions();
    }, [syllabusId]);

    useEffect(() => {
        if (!syllabusId) {
            setVerA("");
            setVerB("");
            return;
        }
        const list = versionList || [];
        if (list.length >= 2) {
            setVerA(list[list.length - 1].version_id);
            setVerB(list[list.length - 2].version_id);
        } else if (list.length === 1) {
            setVerA(list[0].version_id);
            setVerB(list[0].version_id);
        } else {
            setVerA("");
            setVerB("");
        }
    }, [syllabusId, versionList]);

    const filteredSyllabi = useMemo(() => {
        if (!searchQ.trim()) return syllabi;
        const q = searchQ.toLowerCase();
        return syllabi.filter(
            (s) =>
                s.course_code?.toLowerCase().includes(q) ||
                s.course_name?.toLowerCase().includes(q)
        );
    }, [searchQ, syllabi]);

    // Tự động chọn giáo trình dựa trên nội dung nhập
    useEffect(() => {
        const q = searchQ.trim().toLowerCase();
        if (!q) {
            // Giữ theo query param nếu có, hoặc để trống
            setSyllabusId(syllabusIdFromQuery || "");
            return;
        }
        if (filteredSyllabi.length === 1) {
            setSyllabusId(String(filteredSyllabi[0].syllabus_id));
            return;
        }
        const exact = filteredSyllabi.find(
            (s) => s.course_name.toLowerCase() === q || s.course_code.toLowerCase() === q
        );
        if (exact) setSyllabusId(String(exact.syllabus_id));
        else setSyllabusId("");
    }, [searchQ, filteredSyllabi, syllabusIdFromQuery]);

    const syllabus = useMemo(
        () => syllabi.find((s) => String(s.syllabus_id) === String(syllabusId)),
        [syllabi, syllabusId]
    );
    const dataA = useMemo(() => versionList.find((v) => v.version_id === verA), [versionList, verA]);
    const dataB = useMemo(() => versionList.find((v) => v.version_id === verB), [versionList, verB]);

    const overviewDiff = useMemo(
        () => diffText(dataA?.snapshot?.overview || "", dataB?.snapshot?.overview || ""),
        [dataA, dataB]
    );
    const cloDiff = useMemo(() => diffList(dataA?.snapshot?.clo || [], dataB?.snapshot?.clo || []), [dataA, dataB]);
    const assessDiff = useMemo(
        () => diffAssess(dataA?.snapshot?.assessments || [], dataB?.snapshot?.assessments || []),
        [dataA, dataB]
    );

    const ready = Boolean(syllabusId && verA && verB && dataA && dataB);

    return (
        <div className="compare-page">
            <div className="compare-header">
                <div>
                    <h1 className="compare-title">So sánh phiên bản giáo trình</h1>
                </div>
            </div>

            <div className="card">
                {error && <div className="error">{error}</div>}
                <div className="compare-controls">
                    <div className="field" style={{ flex: 1 }}>
                        <label>Tìm kiếm giáo trình</label>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Tên hoặc mã giáo trình (course_code)"
                            value={searchQ}
                            onChange={(e) => setSearchQ(e.target.value)}
                            disabled={loadingSyllabi}
                        />
                    </div>

                    <div className="field">
                        <label>Phiên bản A (hiện tại)</label>
                        <select value={verA} onChange={(e) => setVerA(e.target.value)} disabled={!syllabusId}>
                            <option value="">-- Chọn --</option>
                            {versionList.map((v) => (
                                <option key={v.version_id} value={v.version_id}>
                                    {v.version_id}  {v.year}  {new Date(v.updated_at).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label>Phiên bản B (so sánh)</label>
                        <select value={verB} onChange={(e) => setVerB(e.target.value)} disabled={!syllabusId}>
                            <option value="">-- Chọn --</option>
                            {versionList.map((v) => (
                                <option key={v.version_id} value={v.version_id}>
                                    {v.version_id}  {v.year}  {new Date(v.updated_at).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {!syllabusId ? (
                <div className="card">
                    <div className="empty">Chọn một giáo trình để bắt đầu.</div>
                </div>
            ) : !verA || !verB ? (
                <div className="card">
                    <div className="empty">Chọn đủ 2 phiên bản để so sánh.</div>
                </div>
            ) : !ready ? (
                <div className="card">
                    <div className="empty">Không tìm thấy dữ liệu phiên bản.</div>
                </div>
            ) : (
                <>
                    <div className="card card-meta">
                        <div className="meta-row">
                            <div className="meta-item">
                                <div className="meta-label">Giáo trình</div>
                                <div className="meta-value">{syllabus?.course_code}  {syllabus?.course_name}</div>
                            </div>
                            <div className="meta-item">
                                <div className="meta-label">Phiên bản A</div>
                                <div className="meta-value mono">{verA}</div>
                            </div>
                            <div className="meta-item">
                                <div className="meta-label">Phiên bản B</div>
                                <div className="meta-value mono">{verB}</div>
                            </div>
                        </div>
                    </div>

                    <div className="comparison-grid">
                        <div className={`card diff-card ${overviewDiff.same ? "diff-same" : "diff-changed"}`}>
                            <div className="diff-header">
                                <h3>Tổng quan</h3>
                                <span className={`badge ${overviewDiff.same ? "badge-same" : "badge-changed"}`}>
                                    {overviewDiff.same ? "Không đổi" : "Có thay đổi"}
                                </span>
                            </div>
                            <div className="diff-content">
                                <div className="diff-column">
                                    <div className="column-label">Phiên bản A</div>
                                    <div className="diff-text">{overviewDiff.a || ""}</div>
                                </div>
                                <div className="diff-column">
                                    <div className="column-label">Phiên bản B</div>
                                    <div className="diff-text">{overviewDiff.b || ""}</div>
                                </div>
                            </div>
                        </div>

                        <div className={`card diff-card ${cloDiff.same ? "diff-same" : "diff-changed"}`}>
                            <div className="diff-header">
                                <h3>CLO (Course Learning Outcomes)</h3>
                                <span className={`badge ${cloDiff.same ? "badge-same" : "badge-changed"}`}>
                                    {cloDiff.same ? "Không đổi" : "Có thay đổi"}
                                </span>
                            </div>
                            <div className="diff-content">
                                <div className="diff-column">
                                    <div className="column-label">Phiên bản A</div>
                                    <ul className="clo-list">
                                        {cloDiff.a.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="diff-column">
                                    <div className="column-label">Phiên bản B</div>
                                    <ul className="clo-list">
                                        {cloDiff.b.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {!cloDiff.same && (
                                <div className="diff-summary">
                                    {cloDiff.added.length > 0 && (
                                        <div className="summary-block">
                                            <div className="summary-title">Thêm mới</div>
                                            <ul className="summary-list added">
                                                {cloDiff.added.map((item, idx) => (
                                                    <li key={idx}>+ {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {cloDiff.removed.length > 0 && (
                                        <div className="summary-block">
                                            <div className="summary-title">Bị xoá</div>
                                            <ul className="summary-list removed">
                                                {cloDiff.removed.map((item, idx) => (
                                                    <li key={idx}>- {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className={`card diff-card ${assessDiff.same ? "diff-same" : "diff-changed"}`}>
                            <div className="diff-header">
                                <h3>Trọng số đánh giá</h3>
                                <span className={`badge ${assessDiff.same ? "badge-same" : "badge-changed"}`}>
                                    {assessDiff.same ? "Không đổi" : "Có thay đổi"}
                                </span>
                            </div>
                            <div className="table-wrap">
                                <table className="assess-table">
                                    <thead>
                                        <tr>
                                            <th>Hạng mục</th>
                                            <th>Phiên bản A</th>
                                            <th>Phiên bản B</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assessDiff.rows.map((row) => (
                                            <tr key={row.name} className={row.changed ? "row-changed" : ""}>
                                                <td className="assess-name">{row.name}</td>
                                                <td className="assess-value">{row.a !== null ? `${row.a}%` : ""}</td>
                                                <td className="assess-value">{row.b !== null ? `${row.b}%` : ""}</td>
                                                <td>
                                                    <span className={`badge ${row.changed ? "badge-changed" : "badge-same"}`}>
                                                        {row.changed ? "Thay đổi" : "Giữ nguyên"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

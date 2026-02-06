import { useEffect, useState } from "react";
import {
  Table,
  Select,
  Button,
  Card,
  message,
  Popconfirm,
  Tag
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import api from "../../../services/api";
import "./courseRelations.css";

const { Option } = Select;

export default function CourseRelations() {
  const [courses, setCourses] = useState([]);
  const [relations, setRelations] = useState([]);

  const [courseId, setCourseId] = useState(null);
  const [relatedCourseId, setRelatedCourseId] = useState(null);
  const [relationType, setRelationType] = useState(null);

  /* =========================
     LOAD DATA
  ========================= */
  const loadCourses = async () => {
    const res = await api.get("/courses");
    setCourses(res.data);
  };

  const loadRelations = async () => {
    const res = await api.get("/course-relations/");
    setRelations(res.data);
  };

  useEffect(() => {
    loadCourses();
    loadRelations();
  }, []);

  /* =========================
     CREATE
  ========================= */
  const createRelation = async () => {
    if (!courseId || !relatedCourseId || !relationType) {
      message.warning("Vui lòng chọn đầy đủ thông tin");
      return;
    }

    if (courseId === relatedCourseId) {
      message.warning("Không thể chọn cùng một học phần");
      return;
    }

    try {
      await api.post("/course-relations/", {
      course_id: courseId,
      prerequisite_course_id: relatedCourseId,
      relation_type: relationType
      });


      message.success("Thêm quan hệ học phần thành công");

      // reset form
      setCourseId(null);
      setRelatedCourseId(null);
      setRelationType(null);

      loadRelations();
    } catch (err) {
      message.error(err.response?.data?.detail || "Thao tác thất bại");
    }
  };

  /* =========================
     DELETE
  ========================= */
  const deleteRelation = async (id) => {
    await api.delete(`/course-relations/${id}`);
    message.success("Đã xóa quan hệ học phần");
    loadRelations();
  };

  /* =========================
     TABLE COLUMNS
  ========================= */
  const columns = [
    {
      title: "Học phần",
      dataIndex: ["course", "course_name"]
    },
    {
      title: "Quan hệ",
      dataIndex: "relation_type",
      render: (v) => {
        switch (v) {
          case "PRECEDENT":
            return <Tag color="gold">Học trước</Tag>;
          case "PREREQUISITE":
            return <Tag color="red">Tiên quyết</Tag>;
          case "CO_REQUISITE":
            return <Tag color="blue">Song hành</Tag>;
          default:
            return v;
        }
      }
    },
    {
      title: "Học phần liên quan",
      dataIndex: ["prerequisite_course", "course_name"]
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Popconfirm
          title="Xóa quan hệ này?"
          onConfirm={() => deleteRelation(record.prerequisite_id)}

        >
          <Button danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  return (
    <div className="cr-container">
      <div className="page-title">Quan hệ học phần</div>

      {/* FORM */}
      <Card className="cr-form">
        <Select
          placeholder="Chọn học phần"
          value={courseId}
          onChange={setCourseId}
          allowClear
        >
          {courses.map((c) => (
            <Option key={c.course_id} value={c.course_id}>
              {c.course_name}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Chọn học phần liên quan"
          value={relatedCourseId}
          onChange={setRelatedCourseId}
          allowClear
        >
          {courses.map((c) => (
            <Option key={c.course_id} value={c.course_id}>
              {c.course_name}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Loại quan hệ"
          value={relationType}
          onChange={setRelationType}
          allowClear
        >
          <Option value="PRECEDENT">Học phần học trước</Option>
          <Option value="PREREQUISITE">Học phần tiên quyết</Option>
          <Option value="CO_REQUISITE">Học phần song hành</Option>
        </Select>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={createRelation}
        >
          Thêm
        </Button>
      </Card>

      {/* TABLE */}
      <Card>
        <Table
          rowKey="prerequisite_id"
          columns={columns}
          dataSource={relations}
          pagination={{ pageSize: 6 }}
        />
      </Card>
    </div>
  );
}

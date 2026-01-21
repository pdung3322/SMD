# Academic Affairs (AA) - Naming Convention Guide

## Hệ thống CSS Class Naming chung cho tất cả trang

### Tiền tố: `aa` (Academic Affairs)
Tất cả class đều bắt đầu với `aa` để dễ dàng tìm kiếm và quản lý.

### Classes cơ bản:

#### Layout & Container
- `.aaDashboard` - Container chính của dashboard
- `.aaPending` - Container chính của pending
- `.aaPloCheck` - Container chính của plo-check
- `.aaLookup` - Container chính của lookup
- `.aaNotification` - Container chính của notification
- `.aaProgram` - Container chính của program

#### Typography
- `.aaTitle` - Tiêu đề chính (h1)
- `.aaSectionTitle` - Tiêu đề section (h2)
- `.aaCardTitle` - Tiêu đề card
- `.aaCardSub` - Mô tả phụ của card

#### Card & Container
- `.aaCard` - Card wrapper
- `.aaCardHeader` - Header của card (filter, search area)
- `.aaCardFooter` - Footer của card
- `.aaSection` - Section wrapper

#### Table
- `.aaTable` - Bảng
- `.aaTableWrapper` - Wrapper cho table
- `.aaTableStrong` - Text trong table với font-weight cao
- `.aaTableRow` - Row trong table (nếu cần style)

#### Form Elements
- `.aaInput` - Input text
- `.aaSelect` - Select dropdown
- `.aaFilterGroup` - Nhóm filter
- `.aaSearch` - Search wrapper

#### Buttons & Links
- `.aaBtn` - Button
- `.aaBtn--primary` - Button primary
- `.aaBtn--ghost` - Button ghost/outline
- `.aaBtn--approve` - Button approve (green)
- `.aaBtn--reject` - Button reject (red)
- `.aaLink` - Link
- `.aaLinkBtn` - Link button

#### Status & Badges
- `.aaStatus` - Status indicator
- `.aaStatus--pending` - Status pending (yellow)
- `.aaStatus--approved` - Status approved (green)
- `.aaStatus--rejected` - Status rejected (red)
- `.aaBadge` - Badge
- `.aaBadge--ok` - Badge ok (green)
- `.aaBadge--warn` - Badge warning (yellow)
- `.aaBadge--error` - Badge error (red)
- `.aaBadge--total` - Badge total (gray)

#### Course Info
- `.aaCourseInfo` - Course information wrapper
- `.aaCourseTitle` - Course title

#### Grid & Layout
- `.aaKpiGrid` - Grid cho KPI cards
- `.aaKpiCard` - KPI card
- `.aaKpiCard--success` - KPI card success
- `.aaKpiCard--warning` - KPI card warning
- `.aaKpiValue` - KPI value
- `.aaKpiLabel` - KPI label

#### Chips & Tags
- `.aaChip` - Chip/tag
- `.aaTag` - Tag
- `.aaStats` - Stats wrapper (với badges)

### Modifier Convention:
Sử dụng `--` để chỉ định modifier:
- `.aaBtn--primary` - Primary button
- `.aaStatus--pending` - Pending status
- `.aaBadge--ok` - Success badge

### Color Palette:
- **Teal (Primary)**: `#0a7f86` (hoặc `#0f766e` cho darker)
- **Green (Success)**: `#059669` hoặc `#16a34a`
- **Yellow (Warning)**: `#d97706` hoặc `#f59e0b`
- **Red (Error)**: `#dc2626` hoặc `#ef4444`
- **Gray**: `#e5e7eb` (border), `#9ca3af` (muted), `#6b7280` (text-muted)

### Responsive Breakpoints:
```css
@media (max-width: 1200px) { /* Desktop XL */ }
@media (max-width: 1024px) { /* Desktop */ }
@media (max-width: 768px) { /* Tablet */ }
@media (max-width: 480px) { /* Mobile */ }
```

## Áp dụng cho tất cả trang:

1. **dashboard.jsx/css** ✅
2. **approval/pending.jsx/css** ✅
3. **approval/plo-check.jsx/css** 
4. **lookup/lookup-by-semester.jsx/css**
5. **lookup/compare-syllabus.jsx/css**
6. **notification/approval-result.jsx/css**
7. **notification/rejected-or-edit.jsx/css**
8. **program/plo-management.jsx/css** (đã có)
9. **program/curriculum.jsx/css**

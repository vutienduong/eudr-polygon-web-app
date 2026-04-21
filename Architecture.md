# 1. MVP architecture

Mục tiêu MVP:

* quản lý polygon / thửa đất
* lưu thông tin hồ sơ cơ bản
* export GeoJSON + report cơ bản
* đủ để demo flow EUDR end-to-end

## Kiến trúc tổng thể

```text
[Web Frontend]
  - React / Next.js
  - Map UI (Leaflet / Mapbox)
  - Form nhập thông tin thửa đất
  - Export screen

        ↓

[Backend API]
  - FastAPI
  - Auth
  - CRUD polygon / land parcel
  - Validation business rules
  - Export service

        ↓

[Database]
  - PostgreSQL + PostGIS
  - parcels
  - owners
  - documents
  - export_jobs

        ↓

[File Storage]
  - S3 compatible / local object storage
  - GeoJSON / KML import files
  - generated reports
  - attachments
```

---

## Các module MVP

### A. Frontend

* Login
* Danh sách thửa đất
* Màn hình bản đồ
* Import polygon
* Form thông tin thửa đất
* Export hồ sơ

### B. Backend

* Auth + RBAC cơ bản
* Polygon parser
* Polygon validation
* Parcel CRUD
* Report generator

### C. DB

Bảng cốt lõi:

* users
* parcels
* parcel_polygons
* parcel_documents
* export_records

---

## Flow MVP

```text
User upload/import polygon
→ Backend parse GeoJSON/KML
→ Save polygon vào PostGIS
→ User nhập metadata thửa đất
→ Backend validate rule cơ bản
→ User bấm export
→ System tạo GeoJSON + traceability report PDF/JSON
```

---

## Tech stack MVP

Tôi recommend:

* Frontend: Next.js
* Map: Leaflet
* Backend: FastAPI
* DB: PostgreSQL + PostGIS
* File: S3/MinIO
* PDF/report: Python templating + WeasyPrint / reportlab

Lý do:

* build nhanh
* dễ maintain
* đủ mạnh cho geo data
* scale lên full system được

---

# 2. Full system architecture

Full system là khi họ muốn làm đúng kiểu platform EUDR thật sự.

## Kiến trúc tổng thể

```text
                    [Web App]
         React / Next.js + Map UI + Admin UI
                          |
                          v
                   [API Gateway / BFF]
                          |
      ------------------------------------------------
      |                    |                         |
      v                    v                         v
[Auth Service]     [Parcel Service]         [Traceability Service]
- RBAC             - polygon mgmt           - batch / lot tracking
- org/user         - parcel metadata        - supplier chain
- audit login      - geo validation         - chain of custody

      |                    |                         |
      ------------------------------------------------
                          |
                          v
                 [Compliance / Export Service]
                 - EUDR report generation
                 - GeoJSON/FDF export
                 - validation pack

                          |
                          v
                   [Risk Engine Service]
                   - overlap check
                   - production sanity rules
                   - deforestation screening
                   - anomaly detection

                          |
                          v
                   [Notification / Job Queue]
                   - async export
                   - alerts
                   - retries

                          |
      ------------------------------------------------
      |                    |                         |
      v                    v                         v
 [Postgres/PostGIS]    [Object Storage]         [Search / Cache]
 geo + business data   docs, reports, shapes    Redis / OpenSearch
```

---

## Module full system

### 1. Identity & Organization

* multi-tenant
* company / farm / supplier hierarchy
* role-based access

### 2. GIS / Parcel Management

* vẽ / import polygon
* edit parcel
* overlap detection
* land registry metadata

### 3. Traceability

* batch / lot tracking
* source → collector → processor → exporter
* mapping shipment với parcel

### 4. Compliance Engine

* generate EUDR package
* validate hồ sơ trước export
* manage submission history

### 5. Risk Engine

* compare parcel với vùng rủi ro
* detect abnormal yield
* detect broken trace chain

### 6. Admin / Audit

* audit trail
* user activity
* data change history

### 7. Mobile / Offline

* field collection
* sync khi có mạng
* GPS capture
* photo/document capture

---

# 3. So sánh MVP vs Full

## MVP

Dành cho:

* demo
* pilot
* 1 khách hàng đầu tiên

Phạm vi:

* polygon
* parcel metadata
* export cơ bản

Đội ngũ:

* 1 fullstack mạnh là có thể kéo được

Timeline:

* 2–4 tuần

---

## Full system

Dành cho:

* product thật
* multi-tenant
* nhiều user
* operational rollout

Phạm vi:

* GIS + traceability + compliance + risk + mobile

Đội ngũ:

* 3–6 người trở lên

Timeline:

* 3–6 tháng+

---

# 4. Data model cốt lõi

## MVP data model

```text
users
- id
- name
- email
- role

parcels
- id
- code
- owner_name
- crop_type
- area_ha
- address
- status
- created_by

parcel_polygons
- id
- parcel_id
- geometry (PostGIS)
- source_file
- validated_at

parcel_documents
- id
- parcel_id
- type
- file_url

export_records
- id
- parcel_id
- export_type
- status
- output_file_url
- created_at
```

---

## Full system thêm

```text
suppliers
batches
batch_movements
shipments
risk_checks
submission_records
organization_units
audit_logs
mobile_sync_logs
```
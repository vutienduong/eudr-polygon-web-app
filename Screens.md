# 🎯 Tổng số screen (MVP hợp lý)

👉 **~10–12 screens**

Chia theo nhóm:

1. Auth
2. Parcel (core)
3. Batch
4. Traceability (lite)
5. Export

---

# 🧩 1. AUTH

## 1. Login Screen

### UI gồm:

* Email
* Password
* Login button

### Action:

* call API `/auth/login`
* lưu token

---

# 🧩 2. DASHBOARD

## 2. Dashboard Screen

### UI gồm:

* Tổng số parcels
* Tổng batch
* Export gần đây
* Quick actions:

  * * Add parcel
  * * Create batch
  * Export report

### Mục tiêu:

👉 overview, không cần fancy

---

# 🧩 3. PARCEL (CORE MODULE)

## 3. Parcel List Screen

### UI gồm:

* Table/list:

  * parcel_code
  * owner
  * commodity
  * area
  * status
* Filter:

  * province
  * commodity
* Button:

  * * Add parcel

### Action:

* GET `/parcels`

---

## 4. Parcel Detail Screen

### UI gồm:

#### Left:

* Map (Leaflet)

  * polygon highlight

#### Right:

* Owner info
* Commodity
* Area
* Documents
* Status

#### Actions:

* Edit
* Upload document
* Export

---

## 5. Create / Edit Parcel Screen

### UI gồm:

#### Section 1: Basic info

* owner name
* commodity
* location
* area

#### Section 2: Polygon

* Upload GeoJSON / KML
* OR draw on map

#### Section 3: Documents

* upload files

---

### Flow:

```text
Upload polygon → validate → save → nhập metadata → submit
```

---

## 6. Polygon Import / Draw Screen

(hoặc embed trong Create Parcel)

### UI:

* Map fullscreen
* Draw tool
* Upload file

### Validation:

* closed polygon
* không self-intersect

---

# 🧩 4. BATCH MODULE

## 7. Batch List Screen

### UI:

* batch_code
* commodity
* quantity
* status

### Filter:

* date
* commodity

---

## 8. Batch Detail Screen

### UI gồm:

* Batch info
* Source parcels:

  * list parcel + contribution
* Documents

---

## 9. Create Batch Screen

### UI:

#### Step 1:

* chọn commodity
* nhập quantity

#### Step 2:

* chọn parcel(s)
* nhập contribution

#### Step 3:

* confirm

---

### Flow:

```text
Select parcels → assign quantity → validate → create batch
```

---

# 🧩 5. TRACEABILITY (MVP LIGHT)

## 10. Batch Movement Screen

### UI:

* timeline:

```text
Farm → Collector → Processor
```

* Add movement button

---

### Form:

* from org
* to org
* quantity
* date

---

👉 MVP chỉ cần:

* manual tracking
* không cần automation

---

# 🧩 6. EXPORT / EUDR

## 11. Export Screen

### UI:

* chọn:

  * batch / shipment

* chọn:

  * parcels liên quan

* Button:

  * Generate report

---

### Output:

* GeoJSON
* PDF report

---

## 12. Export History Screen

### UI:

* list export:

  * date
  * status
  * download

---

# 🔄 FULL FLOW (rất quan trọng)

```text
Create Parcel
→ Upload polygon
→ Validate

Create Batch
→ Link parcels

(Optional) Add movements

Export
→ Generate EUDR report
```

---

# 🧠 UX nguyên tắc bạn cần giữ

## 1. Map luôn là trung tâm

* parcel detail = map + info

---

## 2. Không over form

* chia step nhỏ

---

## 3. Data > UI

* focus:

  * chính xác
  * validate